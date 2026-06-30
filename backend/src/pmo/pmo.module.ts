import { Module } from '@nestjs/common';
import { PmoController } from './pmo.controller';
import { PmoService } from './pmo.service';

@Module({
  controllers: [PmoController],
  providers: [PmoService],
})
export class PmoModule {}
