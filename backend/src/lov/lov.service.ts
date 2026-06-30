import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class LovService {
  constructor(private prisma: PrismaService) {}

  async getCategory(category: string) {
    return this.prisma.lovItem.findMany({
      where: { category, active: true },
      orderBy: { order: 'asc' },
    });
  }

  async create(dto: { category: string; value: string; label: string; order?: number }) {
    return this.prisma.lovItem.create({ data: dto });
  }

  async update(id: string, dto: { label?: string; active?: boolean; order?: number }) {
    const item = await this.prisma.lovItem.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('LOV item no encontrado');
    return this.prisma.lovItem.update({ where: { id }, data: dto });
  }

  async validateValue(category: string, value: string): Promise<boolean> {
    const item = await this.prisma.lovItem.findFirst({
      where: { category, value, active: true },
    });
    return !!item;
  }
}
