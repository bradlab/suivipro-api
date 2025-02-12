import { Module } from '@nestjs/common';
import { GlobalSeed } from './global.seed';
import { StaffModule } from 'admin/manager';

@Module({
  imports: [StaffModule],
  providers: [GlobalSeed],
})
export class SeedsModule {}
