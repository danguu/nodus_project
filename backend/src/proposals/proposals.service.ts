import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { WorkflowService } from '../workflow/workflow.service';

@Injectable()
export class ProposalsService {
  constructor(
    private prisma: PrismaService,
    private workflow: WorkflowService,
  ) {}

  async create(caseId: string, dto: any, user: any) {
    const caso = await this.prisma.case.findUnique({ where: { id: caseId } });
    if (!caso) throw new NotFoundException('Caso no encontrado');

    if (caso.consultantId) {
      const consultant = await this.prisma.consultant.findUnique({ where: { id: caso.consultantId } });
      if (consultant?.userId !== user.id && user.role !== 'ADVISORY' && user.role !== 'SUPER_ADMIN') {
        throw new ForbiddenException('Solo el consultor asignado puede crear la propuesta');
      }
    }

    return this.prisma.proposal.create({
      data: {
        caseId,
        consultantId: caso.consultantId,
        version: 1,
        executiveSummary: dto.executiveSummary,
        objective: dto.objective,
        scope: dto.scope,
        exclusions: dto.exclusions,
        activities: dto.activities,
        deliverables: dto.deliverables,
        timeline: dto.timeline,
        effortValuation: dto.effortValuation,
        conditionsAssumptions: dto.conditionsAssumptions,
        status: 'BORRADOR',
      },
    });
  }

  async update(proposalId: string, dto: any, user: any) {
    const existing = await this.prisma.proposal.findUnique({ where: { id: proposalId } });
    if (!existing) throw new NotFoundException('Propuesta no encontrada');

    return this.prisma.proposal.create({
      data: {
        caseId: existing.caseId,
        consultantId: existing.consultantId,
        version: existing.version + 1,
        executiveSummary: dto.executiveSummary ?? existing.executiveSummary,
        objective: dto.objective ?? existing.objective,
        scope: dto.scope ?? existing.scope,
        exclusions: dto.exclusions ?? existing.exclusions,
        activities: dto.activities ?? existing.activities,
        deliverables: dto.deliverables ?? existing.deliverables,
        timeline: dto.timeline ?? existing.timeline,
        effortValuation: dto.effortValuation ?? existing.effortValuation,
        conditionsAssumptions: dto.conditionsAssumptions ?? existing.conditionsAssumptions,
        status: 'BORRADOR',
      },
    });
  }

  async methodologicalReview(proposalId: string, dto: { methodologicalReview: any; approved: boolean }, user: any) {
    const proposal = await this.prisma.proposal.findUnique({ where: { id: proposalId } });
    if (!proposal) throw new NotFoundException('Propuesta no encontrada');

    await this.prisma.proposal.update({
      where: { id: proposalId },
      data: { methodologicalReview: dto.methodologicalReview },
    });

    if (dto.approved) {
      return this.workflow.transition(proposal.caseId, user.id, user.role, 'QA aprobado vía TP4H');
    }

    return { message: 'Revisión registrada, pendiente de aprobación' };
  }

  async authorizeSend(proposalId: string, user: any) {
    const proposal = await this.prisma.proposal.findUnique({ where: { id: proposalId } });
    if (!proposal) throw new NotFoundException('Propuesta no encontrada');

    await this.prisma.proposal.update({
      where: { id: proposalId },
      data: { status: 'ENVIADA' },
    });

    return this.workflow.transition(proposal.caseId, user.id, user.role, 'Propuesta autorizada y enviada');
  }
}
