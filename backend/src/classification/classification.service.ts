import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { WorkflowService } from '../workflow/workflow.service';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class ClassificationService {
  constructor(
    private prisma: PrismaService,
    private workflow: WorkflowService,
    private audit: AuditService,
  ) {}

  async classify(caseId: string, dto: {
    observations: string;
    area: string;
    complejidad: string;
    impacto: string;
    interventionType: string;
    clasificacion: string;
  }, user: any) {
    const caso = await this.prisma.case.findUnique({ where: { id: caseId } });
    if (!caso) throw new NotFoundException('Caso no encontrado');

    const lovValid = await this.prisma.lovItem.findFirst({ where: { category: 'area', value: dto.area } });
    if (!lovValid) throw new BadRequestException('Área no válida (RF-021)');

    await this.prisma.case.update({
      where: { id: caseId },
      data: {
        area: dto.area,
        complexity: dto.complejidad as any,
        impact: dto.impacto as any,
        interventionType: dto.interventionType,
        classification: dto.clasificacion,
      },
    });

    await this.audit.log({
      caseId,
      actorId: user.id,
      action: 'Clasificación completada',
      entity: 'Case',
      previousState: caso.status,
      description: `Área: ${dto.area}, Tipo: ${dto.interventionType}, Clasificación: ${dto.clasificacion}`,
    });

    return this.workflow.transition(caseId, user.id, user.role, 'Clasificado vía T2');
  }
}
