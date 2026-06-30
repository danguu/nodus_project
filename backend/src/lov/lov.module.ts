import { Module } from '@nestjs/common';
import { LovController } from './lov.controller';
import { LovService } from './lov.service';

@Module({
  controllers: [LovController],
  providers: [LovService],
  exports: [LovService],
})
export class LovModule {}
