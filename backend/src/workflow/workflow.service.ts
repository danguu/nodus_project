import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CaseStatus, Role } from '@prisma/client';

export interface Transition {
  next: CaseStatus;
  allowedRoles: Role[];
  label: string;
  requiredChecks?: (caseId: string, prisma: PrismaService) => Promise<void>;
}

// Motor de transiciones — RF que bloquea avances sin cumplimiento
export const TRANSITIONS: Record<string, Transition> = {
  CREADO: {
    next: CaseStatus.EN_REVISION,
    allowedRoles: [Role.ADVISORY, Role.SUPER_ADMIN],
    label: 'Iniciar revisión',
  },
  EN_REVISION: {
    next: CaseStatus.CLASIFICADO,
    allowedRoles: [Role.ADVISORY, Role.SUPER_ADMIN],
    label: 'Clasificar caso (T2)',
  },
  CLASIFICADO: {
    next: CaseStatus.EN_POSTULACION,
    allowedRoles: [Role.ADVISORY, Role.SUPER_ADMIN],
    label: 'Publicar en bolsa',
  },
  EN_POSTULACION: {
    next: CaseStatus.ASIGNADO,
    allowedRoles: [Role.ADVISORY, Role.SUPER_ADMIN],
    label: 'Asignar consultor (T3D)',
    requiredChecks: async (caseId, prisma) => {
      const assigned = await prisma.case.findUnique({
        where: { id: caseId },
        select: { consultantId: true },
      });
      if (!assigned?.consultantId) {
        throw new BadRequestException('Debe asignar un consultor antes de avanzar (RF-032)');
      }
    },
  },
  ASIGNADO: {
    next: CaseStatus.PROPUESTA_EN_DISENO,
    allowedRoles: [Role.ADVISORY, Role.SUPER_ADMIN],
    label: 'Habilitar expediente propuesta',
  },
  PROPUESTA_EN_DISENO: {
    next: CaseStatus.PROPUESTA_LISTA_QA,
    allowedRoles: [Role.CONSULTOR, Role.ADVISORY, Role.SUPER_ADMIN],
    label: 'Consolidar propuesta (TP4H)',
    requiredChecks: async (caseId, prisma) => {
      const proposal = await prisma.proposal.findFirst({
        where: { caseId, methodologicalReview: { not: null } },
      });
      if (!proposal) {
        throw new BadRequestException(
          'El checklist TP4H (revisión metodológica) debe completarse antes de avanzar (RF-046)',
        );
      }
    },
  },
  PROPUESTA_LISTA_QA: {
    next: CaseStatus.PROPUESTA_ENVIADA,
    allowedRoles: [Role.ADVISORY, Role.SUPER_ADMIN],
    label: 'Autorizar y enviar al cliente (RF-055)',
  },
  PROPUESTA_ENVIADA: {
    next: CaseStatus.EN_DECISION,
    allowedRoles: [Role.ADVISORY, Role.SUPER_ADMIN],
    label: 'Abrir período de decisión',
  },
  EN_DECISION: {
    next: CaseStatus.PROPUESTA_ACEPTADA,
    allowedRoles: [Role.MIPYME, Role.ADVISORY, Role.SUPER_ADMIN],
    label: 'Aceptar propuesta (TP6D)',
  },
  PROPUESTA_ACEPTADA: {
    next: CaseStatus.PENDIENTE_CONTRATACION,
    allowedRoles: [Role.ADVISORY, Role.SUPER_ADMIN],
    label: 'Abrir checklist T7A',
  },
  PENDIENTE_CONTRATACION: {
    next: CaseStatus.AUTORIZADO_EJECUCION,
    allowedRoles: [Role.ADVISORY, Role.SUPER_ADMIN],
    label: 'Autorizar ejecución',
    requiredChecks: async (caseId, prisma) => {
      // RF-070: impide inicio sin checklist completo
      const items = await prisma.contractingItem.findMany({ where: { caseId } });
      const incomplete = items.filter((i) => i.status !== 'cumplido');
      if (items.length === 0 || incomplete.length > 0) {
        throw new BadRequestException(
          `Checklist T7A incompleto: ${incomplete.length} ítem(s) pendientes (RF-070)`,
        );
      }
      const framework = await prisma.operationalFramework.findUnique({ where: { caseId } });
      if (!framework) {
        throw new BadRequestException('Marco operativo T7B no ha sido cargado (RF-068)');
      }
    },
  },
  AUTORIZADO_EJECUCION: {
    next: CaseStatus.EN_EJECUCION,
    allowedRoles: [Role.ADVISORY, Role.SUPER_ADMIN],
    label: 'Activar agenda T8A',
  },
  EN_EJECUCION: {
    next: CaseStatus.CERRADO,
    allowedRoles: [Role.ADVISORY, Role.SUPER_ADMIN],
    label: 'Cerrar caso (T9C)',
    requiredChecks: async (caseId, prisma) => {
      const pendingDeliverables = await prisma.deliverable.count({
        where: { caseId, isFinal: false, status: { not: 'LISTO_CIERRE' } },
      });
      if (pendingDeliverables > 0) {
        throw new BadRequestException(
          `${pendingDeliverables} entregable(s) no están marcados como is_final (T9B)`,
        );
      }
    },
  },
};

@Injectable()
export class WorkflowService {
  constructor(private prisma: PrismaService) {}

  async transition(caseId: string, actorId: string, actorRole: Role, notes?: string) {
    const caseRecord = await this.prisma.case.findUniqueOrThrow({ where: { id: caseId } });
    const tr = TRANSITIONS[caseRecord.status];

    if (!tr) throw new BadRequestException('El caso está en un estado final');
    if (!tr.allowedRoles.includes(actorRole)) {
      throw new ForbiddenException(`Rol ${actorRole} no puede ejecutar esta transición`);
    }

    // Run required checks (blocking rules)
    if (tr.requiredChecks) await tr.requiredChecks(caseId, this.prisma);

    // Atomic: update status + write audit log
    const [updated] = await this.prisma.$transaction([
      this.prisma.case.update({
        where: { id: caseId },
        data: { status: tr.next },
      }),
      this.prisma.auditLog.create({
        data: {
          caseId,
          actorId,
          action: tr.label,
          entity: 'Case',
          previousState: caseRecord.status,
          newState: tr.next,
          description: notes,
        },
      }),
    ]);

    return updated;
  }
}
