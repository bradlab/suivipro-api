import { forwardRef, Module } from '@nestjs/common';

import { SubscriptionController } from './subscription.controller';
import { StoreService } from './store.service';
import { IStoreService } from './store.service.interface';
import { StaffModule } from 'admin/manager';

@Module({
  imports: [forwardRef(() => StaffModule)],
  controllers: [SubscriptionController],
  providers: [{ provide: IStoreService, useClass: StoreService }],
  exports: [IStoreService],
})
export class StoreModule {}
