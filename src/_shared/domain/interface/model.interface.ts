import { SexEnum, MaritalStatusEnum } from 'app/enum';

export abstract class ITimestamp {
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export class Permission extends ITimestamp {
  id: string;
  designation: string;
  description?: string;
  value: string;
  group?: string;
  isActivated: boolean;
}

export class Job extends ITimestamp {
  id: string;
  designation: string;
  description?: string;
  isActivated: boolean;
  permissions?: Permission[];
}

export interface User extends ITimestamp {
  id: string;
  matricule: string;
  firstname: string;
  lastname: string;
  email?: string;
  phone: string;
  address?: string;
  country?: string;
  permissions?: Permission[];
  sex?: SexEnum;
  job?: Job;
  maritalStatus?: MaritalStatusEnum;
  isActivated: boolean;
}

export interface OUser extends Omit<User, 'job'> {
  job?: string;
}

export interface IPosition {
  lat: number;
  lng: number;
}
