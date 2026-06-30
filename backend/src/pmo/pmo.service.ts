import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PmoService {
  constructor(private prisma: PrismaService) {}

  async getKpis() {
    const finalStatuses = ['CERRADO', 'CERRADO_SIN_CONTRATACION'] as any;

    const casosActivos = await this.prisma.case.count({
      where: { status: { notIn: finalStatuses } },
    });

    const slasCriticos = await this.prisma.slaAlert.count({
      where: {
        resolvedAt: null,
        level: { in: ['critica', 'escalada'] },
      },
    });

    const enviadas = await this.prisma.case.count({
      where: { auditLogs: { some: { action: 'Autorizar y enviar al cliente (RF-055)' } } },
    });

    const aceptadas = await this.prisma.case.count({
      where: { clientDecisions: { some: { decision: 'aceptar' } } },
    });

    const tasaConversion = enviadas > 0 ? (aceptadas / enviadas) * 100 : 0;

    const casosCerrados = await this.prisma.case.count({
      where: { status: { in: finalStatuses } },
    });

    return { casosActivos, slasCriticos, tasaConversion: Math.round(tasaConversion * 100) / 100, casosCerrados };
  }

  async getCasesByStatus() {
    const statuses: any = [
      'CREADO', 'EN_REVISION', 'CLASIFICADO', 'EN_POSTULACION',
      'ASIGNADO', 'PROPUESTA_EN_DISENO', 'PROPUESTA_LISTA_QA',
      'PROPUESTA_ENVIADA', 'EN_DECISION', 'PROPUESTA_ACEPTADA',
      'PENDIENTE_CONTRATACION', 'AUTORIZADO_EJECUCION',
      'EN_EJECUCION', 'CERRADO', 'CERRADO_SIN_CONTRATACION',
    ];

    const counts = await Promise.all(
      statuses.map((status) =>
        this.prisma.case.count({ where: { status: status as any } }).then((count) => ({ status, count })),
      ),
    );

    return counts;
  }

  async getSlaReport() {
    const rules = await this.prisma.slaRule.findMany({ where: { active: true } });
    const report = [];

    for (const rule of rules) {
      const cases = await this.prisma.case.findMany({
        where: { status: { notIn: ['CERRADO', 'CERRADO_SIN_CONTRATACION'] } },
        select: { updatedAt: true },
      });

      if (cases.length === 0) {
        report.push({ module: rule.module, avgHours: 0, totalCases: 0 });
        continue;
      }

      const totalHours = cases.reduce((sum, c) => {
        return sum + (Date.now() - c.updatedAt.getTime()) / 3600000;
      }, 0);

      report.push({
        module: rule.module,
        avgHours: Math.round((totalHours / cases.length) * 100) / 100,
        totalCases: cases.length,
      });
    }

    return report;
  }
}
