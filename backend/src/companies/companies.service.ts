import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CompaniesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: { name: string; nit?: string; emailDomain?: string; country?: string; city?: string; sector?: string }) {
    if (dto.nit) {
      const dupNit = await this.prisma.company.findUnique({ where: { nit: dto.nit } });
      if (dupNit) throw new ConflictException('Ya existe una empresa con este NIT (RF-002)');
    }
    if (dto.name) {
      const dupName = await this.prisma.company.findFirst({ where: { name: dto.name } });
      if (dupName) throw new ConflictException('Ya existe una empresa con este nombre (RF-003)');
    }
    if (dto.emailDomain) {
      const dupDomain = await this.prisma.company.findFirst({ where: { emailDomain: dto.emailDomain } });
      if (dupDomain) throw new ConflictException('Ya existe una empresa con este dominio de email');
    }

    return this.prisma.company.create({ data: dto });
  }

  async findAll() {
    return this.prisma.company.findMany({ orderBy: { name: 'asc' } });
  }

  async findOne(id: string) {
    const company = await this.prisma.company.findUnique({
      where: { id },
      include: {
        cases: {
          include: { consultant: { include: { user: { select: { name: true } } } } },
          orderBy: { createdAt: 'desc' },
        },
      },
    });
    if (!company) throw new NotFoundException('Empresa no encontrada');
    return company;
  }

  async update(id: string, dto: any) {
    const company = await this.prisma.company.findUnique({ where: { id } });
    if (!company) throw new NotFoundException('Empresa no encontrada');
    return this.prisma.company.update({ where: { id }, data: dto });
  }
}
