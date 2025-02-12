import { Module } from '@nestjs/common';
import { AnnonceModule } from './prestation';
import { PointModule } from './transaction';
import { StoreModule } from './subscription';
import { StaffModule } from './manager';
import { ClientModule } from './client';

@Module({
  imports: [StaffModule, ClientModule, AnnonceModule, PointModule, StoreModule],
  exports: [StaffModule, ClientModule, AnnonceModule, PointModule, StoreModule],
})
export class MarketModule {}
