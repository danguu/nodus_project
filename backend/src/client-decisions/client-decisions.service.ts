import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { WorkflowService } from '../workflow/workflow.service';

@Injectable()
export class ClientDecisionsService {
  constructor(
    private prisma: PrismaService,
    private workflow: WorkflowService,
  ) {}

  async decide(caseId: string, dto: {
    decision: 'aceptar' | 'ajustes' | 'no_continuar';
    formalAcceptance?: any;
    adjustmentRequest?: string;
    closureReason?: string;
  }, user: any) {
    const caso = await this.prisma.case.findUnique({ where: { id: caseId } });
    if (!caso) throw new NotFoundException('Caso no encontrado');

    switch (dto.decision) {
      case 'aceptar': {
        await this.prisma.clientDecision.create({
          data: {
            caseId: caseId,
            decision: 'aceptar',
            formalAcceptance: dto.formalAcceptance ?? {},
          } as any,
        });
        await this.workflow.transition(caseId, user.id, user.role, 'Propuesta aceptada por el cliente');

        const items = [
          { activity: 'Revisar y firmar contrato', responsible: 'Consultor' },
          { activity: 'Validar condiciones operativas', responsible: 'Advisory' },
          { activity: 'Cargar marco operativo T7B', responsible: 'Consultor' },
        ];
        for (const item of items) {
          await this.prisma.contractingItem.create({
            data: { caseId, ...item, targetDate: new Date(Date.now() + 7 * 86400000), status: 'pendiente' },
          });
        }
        return { message: 'Propuesta aceptada, checklist T7A generado' };
      }

      case 'ajustes': {
        await this.prisma.clientDecision.create({
          data: {
            caseId: caseId,
            decision: 'ajustes',
            adjustmentRequest: dto.adjustmentRequest,
          } as any,
        });
        return this.workflow.transition(caseId, user.id, user.role, 'Ajustes solicitados vía TP6B');
      }

      case 'no_continuar': {
        await this.prisma.clientDecision.create({
          data: {
            caseId: caseId,
            decision: 'no_continuar',
            closureReason: dto.closureReason,
          } as any,
        });
        await this.prisma.case.update({
          where: { id: caseId },
          data: { status: 'CERRADO_SIN_CONTRATACION' },
        });
        return { message: 'Caso cerrado sin contratación' };
      }

      default:
        throw new BadRequestException('Decisión no válida');
    }
  }
}
