import { IRegisterClientDTO } from 'admin/auth/auth.service.interface';
import { HashFactory } from 'adapter/hash.factory';
import { DataHelper } from 'adapter/helper/data.helper';
import { StoreFactory } from './store.factory';
import { IUpdateClientDTO } from 'admin/manager/staff.service.interface';
import { Client, OClient } from '../model/client.model';

export abstract class ClientFactory {
  static async create(data: IRegisterClientDTO): Promise<Client> {
    const client = new Client();
    client.email = data.email;
    client.phone = data.phone;
    client.religion = data.religion;
    client.email = data.email;
    client.phone = data.phone;
    client.maritalStatus = data.maritalStatus;
    client.firstname = data.firstname;
    client.lastname = data.lastname;
    client.avatar = data.avatar;
    client.username = data.username;
    client.fullname =
      data.fullname ?? DataHelper.getFullName(data.firstname, data.lastname);
    client.address = data.address;
    client.sex = data.sex;
    client.gps = data.gps;
    client.country = data.country;
    if (data.isMerchant) {
      client.isMerchant = String(data.isMerchant) == 'true';
    }
    client.isMerchant = data.isMerchant;
    client.password = await HashFactory.hashPwd(data.password);
    return client;
  }

  static update(client: Client, data: IUpdateClientDTO, all = false): Client {
    client.maritalStatus = data.maritalStatus ?? client.maritalStatus;
    client.firstname = data.firstname ?? client.firstname;
    client.lastname = data.lastname ?? client.lastname;
    client.address = data.address ?? client.address;
    client.country = data.country ?? client.country;
    client.avatar = data.avatar ?? client.avatar;
    client.isMerchant = data.isMerchant ?? client.isMerchant;
    client.username = data.username ?? client.username;
    if (data.firstname || data.lastname) {
      client.fullname = DataHelper.getFullName(
        client.firstname!,
        client.lastname!,
      );
    }
    client.sex = data.sex ?? client.sex;
    client.gps = data.gps ?? client.gps;
    if (all) {
      client.email = data.email ?? client.email;
      client.phone = data.phone ?? data.phone;
    }

    return client;
  }
  static updateUsername(client: Client, data: IUpdateClientDTO): Client {
    client.email = data.email ?? client.email;
    client.phone = data.phone ?? data.phone;

    return client;
  }

  static getClient(client: Client): OClient {
    if (client) {
      return {
        id: client.id,
        email: client.email,
        phone: client.phone,
        firstname: client.firstname,
        lastname: client.lastname,
        fullname: client.fullname,
        address: client.address,
        isMerchant: client.isMerchant,
        points: client.points,
        country: client.country,
        logo: DataHelper.getFileLink(client.logo!),
        username: client.username,
        sex: client.sex,
        gps: client.gps,
        stores: StoreFactory.getStores(client.subscriptions!),
        maritalStatus: client.maritalStatus,
        isActivated: client.isActivated,
        createdAt: client.createdAt,
        updatedAt: client.updatedAt,
      };
    }
    return null as any;
  }
}
