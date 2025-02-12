import { forwardRef, Module } from '@nestjs/common';

import { TransactionService } from './transaction.service';
import { IPointService } from './point.service.interface';
import { TransactionController } from './transaction.controller';
import { StaffModule } from 'admin/manager';

@Module({
  imports: [forwardRef(() => StaffModule)],
  controllers: [TransactionController],
  providers: [{ provide: IPointService, useClass: TransactionService }],
  exports: [IPointService],
})
export class PointModule {}
