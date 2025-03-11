import { IRegisterClientDTO } from 'admin/auth/auth.service.interface';
import { HashFactory } from 'adapter/hash.factory';
import { Staff, OStaff } from '../model/staff.model';
import { DataHelper } from 'adapter/helper/data.helper';
import { SubscriptionFactory } from './subscription.factory';
import { IUpdateClientDTO } from 'admin/manager/staff.service.interface';

export abstract class StaffFactory {
  static async create(data: IRegisterClientDTO): Promise<Staff> {
    const user = new Staff();
    user.email = data.email;
    user.phone = data.phone;
    user.religion = data.religion;
    user.email = data.email;
    user.phone = data.phone;
    user.maritalStatus = data.maritalStatus;
    user.firstname = data.firstname;
    user.lastname = data.lastname;
    user.avatar = data.avatar;
    user.username = data.username;
    user.fullname =
      data.fullname ?? DataHelper.getFullName(data.firstname, data.lastname);
    user.address = data.address;
    user.sex = data.sex;
    user.country = data.country;
    user.password = await HashFactory.hashPwd(data.password);
    return user;
  }

  static update(client: Staff, data: IUpdateClientDTO, all = false): Staff {
    client.maritalStatus = data.maritalStatus ?? client.maritalStatus;
    client.firstname = data.firstname ?? client.firstname;
    client.lastname = data.lastname ?? client.lastname;
    client.address = data.address ?? client.address;
    client.country = data.country ?? client.country;
    client.avatar = data.avatar ?? client.avatar;
    client.username = data.username ?? client.username;
    if (data.firstname || data.lastname) {
      client.fullname = DataHelper.getFullName(
        client.firstname!,
        client.lastname!,
      );
    }
    client.sex = data.sex ?? client.sex;
    if (all) {
      client.email = data.email ?? client.email;
      client.phone = data.phone ?? data.phone;
    }

    return client;
  }
  static updateUsername(client: Staff, data: IUpdateClientDTO): Staff {
    client.email = data.email ?? client.email;
    client.phone = data.phone ?? data.phone;

    return client;
  }

  static getClient(client: Staff): OStaff {
    if (client) {
      return {
        id: client.id,
        email: client.email,
        phone: client.phone,
        firstname: client.firstname,
        lastname: client.lastname,
        fullname: client.fullname,
        address: client.address,
        country: client.country,
        avatar: DataHelper.getFileLink(client.avatar!),
        username: client.username,
        sex: client.sex,
        maritalStatus: client.maritalStatus,
        isActivated: client.isActivated,
        createdAt: client.createdAt,
        updatedAt: client.updatedAt,
      };
    }
    return null as any;
  }
}
