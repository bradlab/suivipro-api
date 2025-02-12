import { Module } from '@nestjs/common';
import { PrestationModule } from './prestation';
import { TransactionModule } from './transaction';
import { SubscriptionModule } from './subscription';
import { StaffModule } from './manager';
import { ClientModule } from './client';

@Module({
  imports: [StaffModule, ClientModule, PrestationModule, TransactionModule, SubscriptionModule],
  exports: [StaffModule, ClientModule, PrestationModule, TransactionModule, SubscriptionModule],
})
export class DashboardModule {}
