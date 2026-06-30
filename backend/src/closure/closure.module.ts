import { Module } from '@nestjs/common';
import { ClosureController } from './closure.controller';
import { ClosureService } from './closure.service';
import { WorkflowModule } from '../workflow/workflow.module';

@Module({
  imports: [WorkflowModule],
  controllers: [ClosureController],
  providers: [ClosureService],
})
export class ClosureModule {}
