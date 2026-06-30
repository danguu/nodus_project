import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { WorkflowService } from '../workflow/workflow.service';
import { AuditService } from '../audit/audit.service';
import { Role, CaseStatus } from '@prisma/client';

@Injectable()
export class CasesService {
  constructor(
    private prisma: PrismaService,
    private workflow: WorkflowService,
    private audit: AuditService,
  ) {}

  async create(dto: any, user: any) {
    const year = new Date().getFullYear();
    const count = await this.prisma.case.count();
    const caseCode = `NOD-${year}-${String(count + 1).padStart(3, '0')}`;

    let companyId = dto.companyId || user.companyId;

    if (!companyId && dto.companyName) {
      const company = await this.prisma.company.create({
        data: { name: dto.companyName, nit: dto.companyNit ?? `TMP-${Date.now()}` },
      });
      companyId = company.id;
    }

    const caso = await this.prisma.case.create({
      data: {
        caseCode,
        title: dto.title,
        description: dto.description,
        area: dto.area,
        urgency: dto.urgency,
        impact: dto.impact,
        complexity: dto.complexity,
        status: CaseStatus.CREADO,
        companyId,
        contactId: user.id,
      },
    });

    await this.audit.log({
      caseId: caso.id,
      actorId: user.id,
      action: 'Caso creado',
      entity: 'Case',
      newState: 'CREADO',
      description: `Caso ${caseCode} creado por ${user.name}`,
    });

    return caso;
  }

  async findAll(query: any, user: any) {
    const where: any = {};

    if (user.role === Role.MIPYME) {
      where.companyId = user.companyId;
    } else if (user.role === Role.CONSULTOR) {
      const consultant = await this.prisma.consultant.findUnique({ where: { userId: user.id } });
      if (consultant) {
        where.OR = [
          { consultantId: consultant.id },
          { status: CaseStatus.EN_POSTULACION },
        ];
      }
    }

    if (query.status) where.status = query.status;
    if (query.area) where.area = query.area;
    if (query.urgency) where.urgency = query.urgency;
    if (query.consultantId) where.consultantId = query.consultantId;

    return this.prisma.case.findMany({
      where,
      include: {
        company: true,
        consultant: { include: { user: { select: { name: true, email: true } } } },
        _count: { select: { applications: true } },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const caso = await this.prisma.case.findUnique({
      where: { id },
      include: {
        company: true,
        consultant: { include: { user: { select: { name: true, email: true } } } },
        applications: { include: { user: { select: { name: true, email: true } } } },
        proposals: { orderBy: { version: 'desc' } },
        clientDecisions: { orderBy: { createdAt: 'desc' } },
        contractingItems: true,
        operationalFramework: true,
                executionAgendas: { include: { activities: true, milestones: true } },
        incidents: true,
        deliverables: { orderBy: { version: 'desc' } },
        evaluations: true,
      },
    });
    if (!caso) throw new NotFoundException('Caso no encontrado');
    return caso;
  }

  async update(id: string, dto: any, user: any) {
    const caso = await this.prisma.case.findUnique({ where: { id } });
    if (!caso) throw new NotFoundException('Caso no encontrado');
    if (caso.status !== CaseStatus.CREADO) {
      throw new ForbiddenException('Solo se puede editar un caso en estado CREADO (RF-013)');
    }

    return this.prisma.case.update({ where: { id }, data: dto });
  }

  async transition(id: string, dto: any, user: any) {
    const caso = await this.prisma.case.findUnique({ where: { id } });
    if (!caso) throw new NotFoundException('Caso no encontrado');

    return this.workflow.transition(id, user.id, user.role, dto.notes);
  }

  async getAuditLog(id: string) {
    return this.audit.getCaseLog(id);
  }
}
