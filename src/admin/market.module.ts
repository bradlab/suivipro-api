import { Module } from '@nestjs/common';
import { AnnonceModule } from './prestation';
import { PointModule } from './transaction';
import { StoreModule } from './subscription';
import { StaffModule } from './manager';

@Module({
  imports: [StaffModule, AnnonceModule, PointModule, StoreModule],
  exports: [StaffModule, AnnonceModule, PointModule, StoreModule],
})
export class MarketModule {}
