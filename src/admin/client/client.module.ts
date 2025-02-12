import { Module } from '@nestjs/common';

import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import { AuthModule } from '../auth';
import { IClientService } from './client.service.interface';
import { ClientGuard } from '../_shared/guard/auth.guard';

@Module({
  imports: [AuthModule],
  controllers: [ClientController],
  providers: [
    ClientGuard,
    { provide: IClientService, useClass: ClientService },
  ],
  exports: [IClientService, AuthModule],
})
export class ClientModule {}
