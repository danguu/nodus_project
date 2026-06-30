import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { SlaService } from './sla.service';
import { Role } from '@prisma/client';

@ApiTags('SLA')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('sla')
export class SlaController {
  constructor(private sla: SlaService) {}

  @Get('alerts')
  @Roles(Role.ADVISORY, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Alertas SLA activas' })
  getAlerts() {
    return this.sla.getAlerts();
  }

  @Get('rules')
  @Roles(Role.ADVISORY, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Reglas SLA' })
  getRules() {
    return this.sla.getRules();
  }

  @Put('rules')
  @Roles(Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Actualizar reglas SLA' })
  updateRules(@Body() dto: { id: string; hours?: number; preventivePct?: number; criticalPct?: number }[]) {
    return this.sla.updateRules(dto);
  }
}
