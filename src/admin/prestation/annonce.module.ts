import { forwardRef, Module } from '@nestjs/common';

import { PrestationController } from './annonce.controller';
import { AnnonceService } from './annonce.service';
import { IPrestationService } from './annonce.service.interface';
import { StaffModule } from 'admin/manager';

@Module({
  imports: [forwardRef(() => StaffModule)],
  controllers: [PrestationController],
  providers: [{ provide: IPrestationService, useClass: AnnonceService }],
  exports: [IPrestationService],
})
export class AnnonceModule {}
