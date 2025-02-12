import { forwardRef, Module } from '@nestjs/common';

import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from './subscription.service';
import { IStoreService } from './subscription.service.interface';
import { StaffModule } from 'admin/manager';

@Module({
  imports: [forwardRef(() => StaffModule)],
  controllers: [SubscriptionController],
  providers: [{ provide: IStoreService, useClass: SubscriptionService }],
  exports: [IStoreService],
})
export class SubscriptionModule {}
