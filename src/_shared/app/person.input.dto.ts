import { SexEnum } from 'app/enum';
import { MaritalStatusEnum } from 'app/enum';
import { Person } from '../domain/interface/person.model';

export abstract class IBasicPersonnalInfoDTO
  implements Omit<Person, 'id' | 'createdAt' | 'updatedAt' | 'isActivated'>
{
  firstname: string;
  lastname: string;
  phone: string;
  sex?: SexEnum;
  email?: string;
  address?: string;
  country?: string;
  maritalStatus?: MaritalStatusEnum;
  religion?: string;
  nationality?: string;
}
export interface IUpdatePersonDTO extends Partial<IBasicPersonnalInfoDTO> {
  id: string;
}
