import { PartialDeep } from 'domain/types';
import { Staff } from 'admin/_shared/model/staff.model';
import { IUpdatePwdDTO } from 'app/auth.input.dto';
import { IForgotPasswordDTO } from 'app/auth.input.dto';
import { ISigninAccoutDTO } from 'app/auth.input.dto';
import { IBasicPersonnalInfoDTO } from 'app/person.input.dto';
import { IPosition } from '../../_shared/domain/interface';

export interface ICreateClientDTO extends IBasicPersonnalInfoDTO {
  avatar?: string;
  isMerchant?: boolean;
  username?: string;
  fullname?: string;
  gps?: IPosition;
}
export interface IRegisterClientDTO extends ICreateClientDTO {
  password: string;
  fullname?: string;
  deviceToken?: string;
}
export interface ISignedClientDTO {
  user: Staff;
  deviceToken?: string;
  accessToken: string;
}
export interface IClientQuery {
  ids?: string[];
  email?: string;
  phone?: string;
}
export interface IResetPasswordDTO extends ISigninAccoutDTO {
  otpCode: string;
}

export abstract class IMarketAuthService {
  abstract signup(data: IRegisterClientDTO): Promise<ISignedClientDTO>;
  abstract signin(data: ISigninAccoutDTO): Promise<ISignedClientDTO>;

  abstract checkEmail(email: string): Promise<boolean>;

  abstract checkPhone(phone: string): Promise<boolean>;

  abstract updatePassword(user: Staff, data: IUpdatePwdDTO): Promise<boolean>;

  abstract forgotPassword(data: IForgotPasswordDTO): Promise<string>;

  abstract resetPassword(data: IResetPasswordDTO): Promise<boolean>;

  abstract search(data: PartialDeep<Staff>): Promise<Staff>;
}
