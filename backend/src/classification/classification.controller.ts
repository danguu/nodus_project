import { Controller, Post, Body, Param, Request, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ClassificationService } from './classification.service';
import { Role } from '@prisma/client';

@ApiTags('Classification')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('cases/:id/classification')
export class ClassificationController {
  constructor(private classification: ClassificationService) {}

  @Post()
  @Roles(Role.ADVISORY, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Clasificar caso — Plantilla T2 (RF-015 a RF-025)' })
  classify(@Param('id') id: string, @Body() dto: any, @Request() req: any) {
    return this.classification.classify(id, dto, req.user);
  }
}
