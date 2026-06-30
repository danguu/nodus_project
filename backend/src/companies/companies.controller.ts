import { Controller, Get, Post, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CompaniesService } from './companies.service';
import { Role } from '@prisma/client';

@ApiTags('Companies')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('companies')
export class CompaniesController {
  constructor(private companies: CompaniesService) {}

  @Post()
  @Roles(Role.ADVISORY, Role.SUPER_ADMIN, Role.MIPYME)
  @ApiOperation({ summary: 'Crear empresa (RF-001 a RF-006)' })
  create(@Body() dto: any) {
    return this.companies.create(dto);
  }

  @Get()
  @Roles(Role.ADVISORY, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Listar empresas' })
  findAll() {
    return this.companies.findAll();
  }

  @Get(':id')
  @Roles(Role.ADVISORY, Role.SUPER_ADMIN, Role.MIPYME)
  @ApiOperation({ summary: 'Detalle de empresa con historial de casos' })
  findOne(@Param('id') id: string) {
    return this.companies.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADVISORY, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Actualizar empresa' })
  update(@Param('id') id: string, @Body() dto: any) {
    return this.companies.update(id, dto);
  }
}
