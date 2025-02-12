import { Module } from '@nestjs/common';

import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import { AuthModule } from '../auth';
import { IClientService } from './client.service.interface';
import { StaffGuard } from '../_shared/guard/auth.guard';

@Module({
  imports: [AuthModule],
  controllers: [ClientController],
  providers: [
    StaffGuard,
    { provide: IClientService, useClass: ClientService },
  ],
  exports: [IClientService, AuthModule],
})
export class ClientModule {}
