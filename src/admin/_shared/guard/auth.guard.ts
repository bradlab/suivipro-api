import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { DataHelper } from 'adapter/helper/data.helper';
import { Request } from 'express';

import { JWT_CONSTANCE } from 'domain/constant/constants';
import { IJwtPayload } from 'domain/interface';
import { Staff } from '../model/staff.model';
import { IMarketAuthService } from '../../auth/auth.service.interface';

export const _extractTokenFromHeader = (
  request: Request,
): string | undefined => {
  const [type, token] = request.headers.authorization?.split(' ') ?? [];
  return type === 'Bearer' ? token : undefined;
};

@Injectable()
export class StaffGuard implements CanActivate {
  private readonly logger = new Logger();

  constructor(
    private authService: IMarketAuthService,
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const isPublic = this.reflector.get<boolean>(
      'isPublic',
      context.getHandler(),
    );
    const apiKey = request.headers['x-api-key'] || request.headers['X-API-KEY'];
    // habituellement true, si la requête vient d'un serveur backend pour permettre des requêtes de seed
    if (isPublic) {
      return true;
    }
    // Le isFront, laisse passé les requêtes qui viennent du front direct de CORE.
    const isFront = this.reflector.get<boolean>(
      'isFront',
      context.getHandler(),
    );
    if (isFront) {
      return apiKey ? false : true;
    }
    try {
      const token = _extractTokenFromHeader(request);
      if (token) {
        const payload: IJwtPayload = await this._getPayload(token);
        const client = await this._validate(payload);
        request['user'] = client;
        // console.log('CLIENT ======== DO ', request.path, client?.id);
        if (!client) {
          throw new UnauthorizedException();
        }
        return true;
      }
      throw new UnauthorizedException();
    } catch (error) {
      if (error.status === 401) {
        throw error;
      }
      return false;
    }
  }

  private async _getPayload(token: string): Promise<IJwtPayload> {
    return await this.jwtService.verifyAsync(token, {
      secret: JWT_CONSTANCE.CLIENT_SECRET,
      ignoreExpiration: true,
    });
  }

  private async _validate(payload: IJwtPayload): Promise<Staff | undefined> {
    let account: Staff;
    if (!DataHelper.isEmpty(payload)) {
      account = await this.authService.search({
        ...payload,
        isActivated: true,
      });
      return account;
    }
  }
}
