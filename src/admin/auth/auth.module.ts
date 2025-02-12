import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MarketAuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JWT_CONSTANCE } from 'domain/constant/constants';
import { MarketRepositoryModule } from '../_shared/database.module';
import { IMarketAuthService } from './auth.service.interface';
import { TransactionModule } from '../transaction';

@Module({
  imports: [
    JwtModule.register({
      secret: JWT_CONSTANCE.CLIENT_SECRET,
      signOptions: { expiresIn: '1 days' },
      verifyOptions: { ignoreExpiration: true },
    }),
    MarketRepositoryModule,
    forwardRef(() => TransactionModule),
  ],
  controllers: [AuthController],
  providers: [{ provide: IMarketAuthService, useClass: MarketAuthService }],
  exports: [IMarketAuthService, JwtModule, MarketRepositoryModule],
})
export class AuthModule {}
