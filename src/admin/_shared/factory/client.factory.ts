import { IRegisterClientDTO } from 'admin/auth/auth.service.interface';
import { HashFactory } from 'adapter/hash.factory';
import { DataHelper } from 'adapter/helper/data.helper';
import { SubscriptionFactory } from './subscription.factory';
import { Client, OClient } from '../model/client.model';
import { ICreateClientDTO, IUpdateClientDTO } from 'admin/client/client.service.interface';

export abstract class ClientFactory {
  static create(data: ICreateClientDTO): Client {
    const client = new Client();
    client.email = data.email;
    client.phone = data.phone;
    client.description = data.description;
    client.logo = data.logo;
    client.fullname = data.fullname;
    client.address = data.address;
    client.NIF = data.NIF;
    client.CNI = data.CNI;
    client.gps = data.gps;
    client.country = data.country;
    return client;
  }

  static update(client: Client, data: IUpdateClientDTO): Client {
    client.CNI = data.CNI ?? client.CNI;
    client.address = data.address ?? client.address;
    client.country = data.country ?? client.country;
    client.logo = data.logo ?? client.logo;
    client.CNI = data.CNI ?? client.CNI;
    client.NIF = data.NIF ?? client.NIF;
    client.description = data.description ?? client.description;
    client.gps = data.gps ?? client.gps;
    client.email = data.email ?? client.email;
    client.phone = data.phone ?? data.phone;

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
        fullname: client.fullname,
        address: client.address,
        country: client.country,
        logo: DataHelper.getFileLink(client.logo!),
        gps: client.gps,
        stores: SubscriptionFactory.getSubscriptions(client.subscriptions!),
        isActivated: client.isActivated,
        createdAt: client.createdAt,
        updatedAt: client.updatedAt,
      };
    }
    return null as any;
  }
}
