import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ConsultantsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: { userId: string; specialties: string[]; level: string; maxComplexity?: string }) {
    return this.prisma.consultant.create({ data: dto as any });
  }

  async findAll(query: { availability?: string; specialty?: string; level?: string }) {
    const where: any = {};
    if (query.availability) where.availability = query.availability;
    if (query.level) where.level = query.level;
    if (query.specialty) where.specialties = { has: query.specialty };

    return this.prisma.consultant.findMany({
      where,
      include: { user: { select: { name: true, email: true, status: true } } },
      orderBy: { reputationScore: 'desc' },
    });
  }

  async findOne(id: string) {
    const consultant = await this.prisma.consultant.findUnique({
      where: { id },
      include: {
        user: { select: { name: true, email: true } },
        cases: { include: { company: true }, orderBy: { createdAt: 'desc' } },
      },
    });
    if (!consultant) throw new NotFoundException('Consultor no encontrado');
    return consultant;
  }

  async update(id: string, dto: any) {
    return this.prisma.consultant.update({ where: { id }, data: dto });
  }
}
