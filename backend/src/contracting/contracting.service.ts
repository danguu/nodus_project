import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { WorkflowService } from '../workflow/workflow.service';

@Injectable()
export class ContractingService {
  constructor(
    private prisma: PrismaService,
    private workflow: WorkflowService,
  ) {}

  async getChecklist(caseId: string) {
    return this.prisma.contractingItem.findMany({ where: { caseId } });
  }

  async updateChecklistItem(caseId: string, itemId: string, dto: { status: string; evidencePath?: string; notes?: string }) {
    const item = await this.prisma.contractingItem.findUnique({ where: { id: itemId } });
    if (!item) throw new NotFoundException('Ítem no encontrado');

    return this.prisma.contractingItem.update({
      where: { id: itemId },
      data: {
        status: dto.status,
        evidencePath: dto.evidencePath,
        notes: dto.notes,
        completionDate: dto.status === 'cumplido' ? new Date() : undefined,
      },
    });
  }

  async createOperationalFramework(caseId: string, dto: {
    operatingConditions: string;
    estimatedDuration: string;
    mainMilestones: any[];
    baseSchedule: any;
    committedDeliverables: any[];
    clientDependencies?: string;
    assumptions?: string;
    executionConstraints?: string;
    primaryContactId?: string;
  }) {
    const caso = await this.prisma.case.findUnique({ where: { id: caseId } });
    if (!caso) throw new NotFoundException('Caso no encontrado');

    const existing = await this.prisma.operationalFramework.findUnique({ where: { caseId } });
    if (existing) throw new BadRequestException('Ya existe un marco operativo para este caso');

    return this.prisma.operationalFramework.create({
      data: {
        caseId,
        operatingConditions: dto.operatingConditions,
        estimatedDuration: dto.estimatedDuration,
        mainMilestones: dto.mainMilestones,
        baseSchedule: dto.baseSchedule,
        committedDeliverables: dto.committedDeliverables,
        clientDependencies: dto.clientDependencies,
        assumptions: dto.assumptions,
        executionConstraints: dto.executionConstraints,
        primaryContactId: dto.primaryContactId,
      },
    });
  }

  async authorizeExecution(caseId: string, user: any) {
    return this.workflow.transition(caseId, user.id, user.role, 'Ejecución autorizada vía RF-070');
  }
}
