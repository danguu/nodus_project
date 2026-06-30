import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ConsultantsService } from './consultants.service';
import { Role } from '@prisma/client';

@ApiTags('Consultants')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('consultants')
export class ConsultantsController {
  constructor(private consultants: ConsultantsService) {}

  @Post()
  @Roles(Role.ADVISORY, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Registrar consultor' })
  create(@Body() dto: any) {
    return this.consultants.create(dto);
  }

  @Get()
  @Roles(Role.ADVISORY, Role.SUPER_ADMIN, Role.MIPYME)
  @ApiOperation({ summary: 'Listar consultores con filtros' })
  findAll(@Query() query: any) {
    return this.consultants.findAll(query);
  }

  @Get(':id')
  @Roles(Role.ADVISORY, Role.SUPER_ADMIN, Role.MIPYME)
  @ApiOperation({ summary: 'Detalle del consultor' })
  findOne(@Param('id') id: string) {
    return this.consultants.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADVISORY, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Actualizar consultor' })
  update(@Param('id') id: string, @Body() dto: any) {
    return this.consultants.update(id, dto);
  }
}
