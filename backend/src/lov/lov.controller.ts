import { Controller, Get, Post, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { LovService } from './lov.service';
import { Role } from '@prisma/client';

@ApiTags('LOV')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('lov')
export class LovController {
  constructor(private lov: LovService) {}

  @Get(':category')
  @ApiOperation({ summary: 'Obtener valores de una categoría LOV (RT-015 a RT-018)' })
  getCategory(@Param('category') category: string) {
    return this.lov.getCategory(category);
  }

  @Post()
  @Roles(Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Crear valor LOV (solo SUPER_ADMIN)' })
  create(@Body() dto: any) {
    return this.lov.create(dto);
  }

  @Patch(':id')
  @Roles(Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Actualizar valor LOV (solo SUPER_ADMIN)' })
  update(@Param('id') id: string, @Body() dto: any) {
    return this.lov.update(id, dto);
  }
}
