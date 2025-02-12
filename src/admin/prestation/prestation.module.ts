import { forwardRef, Module } from '@nestjs/common';

import { PrestationController } from './prestation.controller';
import { PrestationService } from './prestation.service';
import { IPrestationService } from './prestation.service.interface';
import { StaffModule } from 'admin/manager';

@Module({
  imports: [forwardRef(() => StaffModule)],
  controllers: [PrestationController],
  providers: [{ provide: IPrestationService, useClass: PrestationService }],
  exports: [IPrestationService],
})
export class PrestationModule {}
