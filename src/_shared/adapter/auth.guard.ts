import {
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { CoreAPIService } from 'framework/api/auth.api.service';
import { RuleEnum } from 'app/enum/rule.enum';

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
    private authAPIServices: CoreAPIService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);
    const permission = this.reflector.getAllAndOverride<RuleEnum>(
      'permission',
      [context.getHandler(), context.getClass()],
    );
    if (isPublic) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const token = _extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const user = await this.authAPIServices.api.tokenLogin(token, permission);
      if (user) request['user'] = user;
      return true;
    } catch (error) {
      if (error.status == 401) throw new UnauthorizedException();
      this.logger.error(error, 'ERROR::StaffGuard');
      throw new InternalServerErrorException();
    }
  }
}
