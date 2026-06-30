import { Module } from '@nestjs/common';
import { ContractingController } from './contracting.controller';
import { ContractingService } from './contracting.service';
import { WorkflowModule } from '../workflow/workflow.module';

@Module({
  imports: [WorkflowModule],
  controllers: [ContractingController],
  providers: [ContractingService],
})
export class ContractingModule {}
