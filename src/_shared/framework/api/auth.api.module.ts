import { Module } from '@nestjs/common';
import { CoreAPIService } from './auth.api.service';

@Module({
  imports: [],
  providers: [CoreAPIService],
  exports: [CoreAPIService],
})
export class AuthApiModule {}
