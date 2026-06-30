import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { WorkflowService } from '../workflow/workflow.service';

@Injectable()
export class ExecutionService {
  constructor(
    private prisma: PrismaService,
    private workflow: WorkflowService,
  ) {}

  async createAgenda(caseId: string, user: any) {
    const caso = await this.prisma.case.findUnique({ where: { id: caseId } });
    if (!caso) throw new NotFoundException('Caso no encontrado');

    const agenda = await this.prisma.executionAgenda.create({
      data: { caseId, version: 1 },
    });

    await this.workflow.transition(caseId, user.id, user.role, 'Agenda T8A creada');
    return agenda;
  }

  async createActivity(caseId: string, dto: { name: string; description?: string; targetDate?: string; responsibleId?: string }) {
    const agenda = await this.prisma.executionAgenda.findFirst({
      where: { caseId },
      orderBy: { version: 'desc' },
    });
    if (!agenda) throw new BadRequestException('Primero debe crear una agenda T8A');

    return this.prisma.activity.create({
      data: {
        agendaId: agenda.id,
        name: dto.name,
        description: dto.description,
        targetDate: dto.targetDate ? new Date(dto.targetDate) : undefined,
        responsibleId: dto.responsibleId,
        status: 'NO_INICIADA',
      },
    });
  }

  async updateActivity(caseId: string, activityId: string, dto: { status?: string; evidencePath?: string }) {
    const activity = await this.prisma.activity.findUnique({ where: { id: activityId } });
    if (!activity) throw new NotFoundException('Actividad no encontrada');

    return this.prisma.activity.update({
      where: { id: activityId },
      data: dto as any,
    });
  }

  async createMilestone(caseId: string, dto: { name: string; targetDate: string; expectedDeliverable?: string; criticality?: string; responsibleId?: string }) {
    const agenda = await this.prisma.executionAgenda.findFirst({
      where: { caseId },
      orderBy: { version: 'desc' },
    });
    if (!agenda) throw new BadRequestException('Primero debe crear una agenda T8A');

    return this.prisma.milestone.create({
      data: {
        agendaId: agenda.id,
        name: dto.name,
        targetDate: new Date(dto.targetDate),
        expectedDeliverable: dto.expectedDeliverable,
        criticality: dto.criticality,
        responsibleId: dto.responsibleId,
        status: 'PENDIENTE',
      },
    });
  }

  async createIncident(caseId: string, dto: { type: string; impact?: string; suggestedAction?: string }) {
    return this.prisma.incident.create({
      data: {
        caseId: caseId,
        reportedBy: 'system',
        type: dto.type,
        impact: dto.impact,
        suggestedAction: dto.suggestedAction,
        status: 'REPORTADO' as any,
      } as any,
    });
  }

  async createDeliverable(caseId: string, dto: { name: string; description?: string; targetDate?: string; responsibleId?: string }) {
    return this.prisma.deliverable.create({
      data: {
        caseId: caseId,
        name: dto.name,
        description: dto.description,
        targetDate: dto.targetDate ? new Date(dto.targetDate) : undefined,
        responsibleId: dto.responsibleId,
        status: 'PENDIENTE' as any,
        version: 1,
        isFinal: false,
      } as any,
    });
  }

  async updateDeliverable(deliverableId: string, dto: { status?: string; filePath?: string; isFinal?: boolean; version?: number }) {
    const deliverable = await this.prisma.deliverable.findUnique({ where: { id: deliverableId } });
    if (!deliverable) throw new NotFoundException('Entregable no encontrado');

    return this.prisma.deliverable.update({
      where: { id: deliverableId },
      data: { ...dto as any, version: dto.filePath ? deliverable.version + 1 : deliverable.version },
    });
  }
}
