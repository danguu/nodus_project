import { Controller, Get, Post, Patch, Body, Param, Request, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ExecutionService } from './execution.service';
import { Role } from '@prisma/client';

@ApiTags('Execution')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('cases/:id')
export class ExecutionController {
  constructor(private execution: ExecutionService) {}

  @Post('agenda')
  @Roles(Role.CONSULTOR, Role.ADVISORY, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Crear agenda de ejecución T8A (RF-073)' })
  createAgenda(@Param('id') id: string, @Request() req: any) {
    return this.execution.createAgenda(id, req.user);
  }

  @Post('activities')
  @Roles(Role.CONSULTOR, Role.ADVISORY, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Crear actividad T8B' })
  createActivity(@Param('id') id: string, @Body() dto: any) {
    return this.execution.createActivity(id, dto);
  }

  @Patch('activities/:activityId')
  @Roles(Role.CONSULTOR, Role.ADVISORY, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Actualizar estado de actividad' })
  updateActivity(@Param('id') id: string, @Param('activityId') activityId: string, @Body() dto: any) {
    return this.execution.updateActivity(id, activityId, dto);
  }

  @Post('milestones')
  @Roles(Role.CONSULTOR, Role.ADVISORY, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Crear hito T8C' })
  createMilestone(@Param('id') id: string, @Body() dto: any) {
    return this.execution.createMilestone(id, dto);
  }

  @Post('incidents')
  @Roles(Role.CONSULTOR, Role.ADVISORY, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Reportar incidencia T8D' })
  createIncident(@Param('id') id: string, @Body() dto: any) {
    return this.execution.createIncident(id, dto);
  }

  @Post('deliverables')
  @Roles(Role.CONSULTOR, Role.ADVISORY, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Registrar entregable T8G' })
  createDeliverable(@Param('id') id: string, @Body() dto: any) {
    return this.execution.createDeliverable(id, dto);
  }

  @Patch('deliverables/:deliverableId')
  @Roles(Role.CONSULTOR, Role.ADVISORY, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Actualizar entregable (nueva versión)' })
  updateDeliverable(@Param('id') id: string, @Param('deliverableId') deliverableId: string, @Body() dto: any) {
    return this.execution.updateDeliverable(deliverableId, dto);
  }
}
