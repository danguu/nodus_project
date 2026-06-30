import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { WorkflowService } from '../workflow/workflow.service';
import { ApplicationStatus, Role } from '@prisma/client';

@Injectable()
export class ApplicationsService {
  constructor(
    private prisma: PrismaService,
    private workflow: WorkflowService,
  ) {}

  async getBolsa(user: any) {
    const consultant = await this.prisma.consultant.findUnique({ where: { userId: user.id } });
    if (!consultant) throw new ForbiddenException('Solo consultores pueden ver la bolsa');

    return this.prisma.case.findMany({
      where: {
        status: 'EN_POSTULACION',
        OR: consultant.specialties.map((s: string) => ({ area: s })),
      },
      include: { company: true },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async apply(caseId: string, dto: { interestStatement: string; relevantExperience: string; availabilityConfirmed: boolean }, user: any) {
    const caso = await this.prisma.case.findUnique({ where: { id: caseId } });
    if (!caso) throw new NotFoundException('Caso no encontrado');
    if (caso.status !== 'EN_POSTULACION') throw new BadRequestException('El caso no está en postulación');

    const existing = await this.prisma.application.findFirst({
      where: { caseId, userId: user.id },
    });
    if (existing) throw new BadRequestException('Ya has postulado a este caso');

    const consultant = await this.prisma.consultant.findUnique({ where: { userId: user.id } });
    if (!consultant) throw new ForbiddenException('Solo consultores pueden postular');

    return this.prisma.application.create({
      data: {
        caseId: caseId,
        userId: user.id,
        interestStatement: dto.interestStatement,
        relevantExperience: dto.relevantExperience,
        availabilityConfirmed: dto.availabilityConfirmed,
        status: ApplicationStatus.PENDIENTE,
      } as any,
    });
  }

  async evaluate(applicationId: string, dto: { evaluationNotes?: string; evaluationScore?: number; decision: string }, user: any) {
    const app = await this.prisma.application.findUnique({ where: { id: applicationId } });
    if (!app) throw new NotFoundException('Postulación no encontrada');

    const updated = await this.prisma.application.update({
      where: { id: applicationId },
      data: {
        evaluationNotes: dto.evaluationNotes,
        evaluationScore: dto.evaluationScore,
        status: dto.decision === 'asignada' ? ApplicationStatus.ASIGNADA : ApplicationStatus.RECHAZADA,
      },
    });

    if (dto.decision === 'asignada') {
      const existingAssigned = await this.prisma.application.findFirst({
        where: { caseId: app.caseId, status: ApplicationStatus.ASIGNADA },
      });
      if (existingAssigned) throw new BadRequestException('Ya hay un responsable asignado a este caso (RF-033)');

      const consultant = await this.prisma.consultant.findUnique({ where: { userId: app.userId } });
      if (!consultant) throw new NotFoundException('Consultor no encontrado');

      await this.prisma.case.update({
        where: { id: app.caseId },
        data: { consultantId: consultant.id },
      });

      return this.workflow.transition(app.caseId, user.id, user.role, 'Consultor asignado vía T3D');
    }

    return updated;
  }
}
