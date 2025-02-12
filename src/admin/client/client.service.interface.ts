import { PartialDeep } from 'domain/types';
import { Staff } from '../_shared/model/staff.model';
import { IClientQuery } from 'admin/auth/auth.service.interface';
import { IRegisterClientDTO } from 'admin/auth/auth.service.interface';
import { ICreateClientDTO } from 'admin/auth/auth.service.interface';
export interface IUpdateClientDTO extends Partial<ICreateClientDTO> {
  id: string;
}

export abstract class IClientService {
  abstract add(data: IRegisterClientDTO): Promise<Staff>;

  abstract fetchAll(param?: IClientQuery): Promise<Staff[]>;

  abstract search(
    data: PartialDeep<Staff>,
    withAccess?: boolean,
  ): Promise<Staff>;

  abstract fetchOne(id: string): Promise<Staff>;

  abstract edit(data: IUpdateClientDTO): Promise<Staff>;

  abstract editCredential(
    user: Staff,
    data: Partial<IUpdateClientDTO>,
  ): Promise<boolean>;

  abstract setState(ids: string[]): Promise<boolean>;

  abstract remove(id: string): Promise<boolean>;

  abstract clean(): Promise<boolean>;
}
