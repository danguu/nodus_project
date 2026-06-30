import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  // Bitácora append-only — RT-001 a RT-005
  async log(data: {
    caseId?: string;
    companyId?: string;
    actorId: string;
    action: string;
    entity: string;
    previousState?: string;
    newState?: string;
    description?: string;
  }) {
    return this.prisma.auditLog.create({ data });
  }

  async getCaseLog(caseId: string) {
    return this.prisma.auditLog.findMany({
      where: { caseId },
      include: { actor: { select: { name: true, role: true } } },
      orderBy: { createdAt: 'asc' },
    });
  }
}
