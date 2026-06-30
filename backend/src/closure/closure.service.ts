import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { WorkflowService } from '../workflow/workflow.service';

@Injectable()
export class ClosureService {
  constructor(
    private prisma: PrismaService,
    private workflow: WorkflowService,
  ) {}

  async technicalClosure(caseId: string, dto: any, user: any) {
    const caso = await this.prisma.case.findUnique({ where: { id: caseId } });
    if (!caso) throw new NotFoundException('Caso no encontrado');

    const committed = await this.prisma.operationalFramework.findUnique({
      where: { caseId },
      select: { committedDeliverables: true },
    });
    if (!committed) throw new BadRequestException('No hay marco operativo T7B');

    const finalDeliverables = await this.prisma.deliverable.count({
      where: { caseId, isFinal: true },
    });
    if (finalDeliverables === 0) {
      throw new BadRequestException('Debe marcar entregables finales T9B antes del cierre técnico');
    }

    return { message: 'Cierre técnico declarado T9A', pendiente: 'Revisión final T9C' };
  }

  async finalDeliverables(caseId: string, dto: { deliverableIds: string[] }) {
    await this.prisma.deliverable.updateMany({
      where: { id: { in: dto.deliverableIds }, caseId },
      data: { isFinal: true },
    });
    return { message: 'Entregables finales confirmados T9B' };
  }

  async finalReview(caseId: string, dto: { approved: boolean; notes?: string }, user: any) {
    if (dto.approved) {
      return this.workflow.transition(caseId, user.id, user.role, 'Revisión final aprobada T9C');
    }
    return { message: 'Revisión rechazada, se requieren ajustes' };
  }

  async clientAcceptance(caseId: string, dto: any, user: any) {
    return this.workflow.transition(caseId, user.id, user.role, 'Cliente aceptó entregables T9F');
  }

  async satisfactionSurvey(caseId: string, dto: { scores: any; comments?: string }) {
    const caso = await this.prisma.case.findUnique({ where: { id: caseId } });
    if (!caso) throw new NotFoundException('Caso no encontrado');

    return this.prisma.evaluation.create({
      data: {
        caseId: caseId,
        type: 'SATISFACCION_CLIENTE',
        targetId: caso.contactId!,
        scores: dto.scores,
        comments: dto.comments,
      } as any,
    });
  }

  async consultantEvaluation(caseId: string, dto: { scores: any; comments?: string }, user: any) {
    const caso = await this.prisma.case.findUnique({ where: { id: caseId } });
    if (!caso) throw new NotFoundException('Caso no encontrado');
    if (!caso.consultantId) throw new BadRequestException('El caso no tiene consultor asignado');

    const evaluation = await this.prisma.evaluation.create({
      data: {
        caseId: caseId,
        type: 'DESEMPENO_CONSULTOR',
        targetId: caso.consultantId,
        scores: dto.scores,
        comments: dto.comments,
      } as any,
    });

    const scores: number[] = Object.values(dto.scores);
    const avg = scores.reduce((a: number, b: number) => a + b, 0) / scores.length;
    await this.prisma.consultant.update({
      where: { id: caso.consultantId },
      data: { reputationScore: avg },
    });

    return evaluation;
  }
}
