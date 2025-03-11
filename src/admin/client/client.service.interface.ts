import { PartialDeep } from 'domain/types';
import { IClientQuery } from 'admin/auth/auth.service.interface';
import { IPosition } from 'domain/interface';
import { Client } from 'admin/_shared/model/client.model';
import { Staff } from 'admin/_shared/model/staff.model';

export interface ICreateClientDTO {
  logo?: string;
  NIF?: string;
  CNI?: string;
  fullname: string;
  gps?: IPosition;
  phone: string;
  email?: string;
  address?: string;
  description?: string;
  country?: string;
}
export interface IUpdateClientDTO extends Partial<ICreateClientDTO> {
  id: string;
}

export abstract class IClientService {
  abstract add(data: ICreateClientDTO): Promise<Client>;

  abstract fetchAll(param?: IClientQuery): Promise<Client[]>;

  abstract search(
    data: PartialDeep<Client>,
    withAccess?: boolean,
  ): Promise<Client>;

  abstract bulkAdd(staff: Staff, datas: ICreateClientDTO[]): Promise<Client[]>;

  abstract fetchOne(id: string): Promise<Client>;

  abstract edit(data: IUpdateClientDTO): Promise<Client>;

  abstract setState(ids: string[]): Promise<boolean>;

  abstract remove(id: string): Promise<boolean>;
}
