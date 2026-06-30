import { Controller, Post, Body, Param, Request, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ClientDecisionsService } from './client-decisions.service';
import { Role } from '@prisma/client';

@ApiTags('Client Decisions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('cases/:id/decision')
export class ClientDecisionsController {
  constructor(private decisions: ClientDecisionsService) {}

  @Post()
  @Roles(Role.MIPYME, Role.ADVISORY, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Decisión del cliente — TP6A-E (RF-057 a RF-065)' })
  decide(@Param('id') id: string, @Body() dto: any, @Request() req: any) {
    return this.decisions.decide(id, dto, req.user);
  }
}
