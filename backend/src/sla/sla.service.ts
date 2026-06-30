import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SlaService {
  private readonly logger = new Logger(SlaService.name);

  constructor(private prisma: PrismaService) {}

  // RT-006 a RT-009: chequeo periódico de SLA
  @Cron(CronExpression.EVERY_HOUR)
  async checkSlaCompliance() {
    this.logger.log('Running SLA compliance check...');
    const rules = await this.prisma.slaRule.findMany({ where: { active: true } });
    const activeCases = await this.prisma.case.findMany({
      where: {
        status: {
          notIn: ['CERRADO', 'CERRADO_SIN_CONTRATACION'],
        },
      },
    });

    for (const rule of rules) {
      for (const c of activeCases) {
        const hoursElapsed = (Date.now() - c.updatedAt.getTime()) / 3600000;
        const pct = (hoursElapsed / rule.hours) * 100;

        if (pct >= 100) {
          await this.triggerAlert(c.id, rule.id, 'escalada');
        } else if (pct >= rule.criticalPct) {
          await this.triggerAlert(c.id, rule.id, 'critica');
        } else if (pct >= rule.preventivePct) {
          await this.triggerAlert(c.id, rule.id, 'preventiva');
        }
      }
    }
  }

  private async triggerAlert(caseId: string, slaRuleId: string, level: string) {
    const existing = await this.prisma.slaAlert.findFirst({
      where: { caseId, slaRuleId, level, resolvedAt: null },
    });
    if (!existing) {
      await this.prisma.slaAlert.create({ data: { caseId, slaRuleId, level } });
      this.logger.warn(`SLA Alert [${level}] → case ${caseId}`);
    }
  }

  async getAlerts() {
    return this.prisma.slaAlert.findMany({
      where: { resolvedAt: null },
      include: { case: { select: { caseCode: true, title: true, status: true } }, slaRule: true },
      orderBy: { triggeredAt: 'desc' },
    });
  }

  async getRules() {
    return this.prisma.slaRule.findMany({ orderBy: { module: 'asc' } });
  }

  async updateRules(dto: { id: string; hours?: number; preventivePct?: number; criticalPct?: number }[]) {
    for (const rule of dto) {
      await this.prisma.slaRule.update({
        where: { id: rule.id },
        data: {
          ...(rule.hours !== undefined && { hours: rule.hours }),
          ...(rule.preventivePct !== undefined && { preventivePct: rule.preventivePct }),
          ...(rule.criticalPct !== undefined && { criticalPct: rule.criticalPct }),
        },
      });
    }
    return { message: 'Reglas SLA actualizadas' };
  }
}
