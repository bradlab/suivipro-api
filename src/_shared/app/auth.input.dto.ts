import { Staff } from 'admin/_shared/model/staff.model';
import { RuleEnum } from './enum';

export interface ISigninAccoutDTO {
  email?: string;
  phone?: string;
  deviceToken?: string;
  password: string;
}
export interface ISignedDTO {
  user: Staff;
  deviceToken?: string;
  accessToken: string;
}
export interface IUserQuery {
  ids?: string[];
  email?: string;
  phone?: string;
  matricule?: string;
  roleID?: string;
  rules?: RuleEnum[];
}
export interface LogoutDTO {
  deviceToken?: string;
}
export interface IForgotPasswordDTO {
  email?: string;
  phone?: string;
}
export interface IResetPasswordDTO extends ISigninAccoutDTO {
  otpCode: string;
}
export interface ISigninAccoutDTO {
  email?: string;
  phone?: string;
  deviceToken?: string;
  password: string;
}
export interface IForgotPasswordDTO {
  email?: string;
  phone?: string;
}
export interface LogoutDTO {
  deviceToken?: string;
}
export interface IUpdatePwdDTO {
  oldPassword: string;
  newPassword: string;
}
