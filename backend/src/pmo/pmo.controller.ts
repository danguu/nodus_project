import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { PmoService } from './pmo.service';
import { Role } from '@prisma/client';

@ApiTags('PMO')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('pmo')
export class PmoController {
  constructor(private pmo: PmoService) {}

  @Get('kpis')
  @Roles(Role.ADVISORY, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'KPIs del dashboard ejecutivo' })
  getKpis() {
    return this.pmo.getKpis();
  }

  @Get('cases-by-status')
  @Roles(Role.ADVISORY, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Conteo de casos por estado' })
  getCasesByStatus() {
    return this.pmo.getCasesByStatus();
  }

  @Get('sla-report')
  @Roles(Role.ADVISORY, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Reporte de tiempos promedio por etapa SLA' })
  getSlaReport() {
    return this.pmo.getSlaReport();
  }
}
