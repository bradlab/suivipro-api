/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
  SetMetadata,
  UnauthorizedException,
  createParamDecorator,
} from '@nestjs/common';
import { DataHelper } from 'adapter/helper/data.helper';
import { RuleEnum } from 'app/enum';
import { User } from 'domain/interface';

export const Public = () => SetMetadata('isPublic', true);
export const HasPermission = (...p: RuleEnum[]) => SetMetadata('permission', p);

export const GetUser = createParamDecorator((_, context): User => {
  const req = context.getArgs()[0];
  if (!DataHelper.isEmpty(req?.user)) return req.user;

  throw new UnauthorizedException();
});
