import { forwardRef, Module } from '@nestjs/common';

import { TransactionService } from './transaction.service';
import { ITransactionService } from './transaction.service.interface';
import { TransactionController } from './transaction.controller';
import { StaffModule } from 'admin/manager';
import { PrestationModule } from 'admin/prestation';

@Module({
  imports: [forwardRef(() => StaffModule), PrestationModule],
  controllers: [TransactionController],
  providers: [{ provide: ITransactionService, useClass: TransactionService }],
  exports: [ITransactionService],
})
export class TransactionModule {}
