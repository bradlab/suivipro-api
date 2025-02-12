/* eslint-disable @typescript-eslint/no-unused-vars */
import { ISubscription, OSubscription } from '../model/subscription.model';
import { IUpdateStoreDTO } from '../../subscription/store.service.interface';
import { ICreateStoreDTO } from '../../subscription/store.service.interface';
import { DataHelper } from '../../../_shared/adapter/helper/data.helper';
import { ClientFactory } from './client.factory';

export abstract class StoreFactory {
  static create(data: ICreateStoreDTO): ISubscription {
    const subscription = new ISubscription();
    subscription.client = data.client;
    subscription.address = data.address;
    subscription.name = data.name;
    subscription.isDefault = data.isDefault ?? false;

    return subscription;
  }

  static update(subscription: ISubscription, data: IUpdateStoreDTO): ISubscription {
    // fais la modification des données de store avec le data
    subscription.name = data.name ?? subscription.name;
    subscription.address = data.address ?? subscription.address;

    return subscription;
  }

  static getSubscription(subscription: ISubscription): OSubscription {
    if (subscription) {
      return {
        id: subscription.id,
        name: subscription.name,
        address: subscription.address,
        isDefault: subscription.isDefault,
        isActivated: subscription.isActivated,
        client: ClientFactory.getClient(subscription.client!),
        createdAt: subscription.createdAt,
        updatedAt: subscription.updatedAt,
      };
    }
    return null as any;
  }
  static getSubscriptions(subscriptions: ISubscription[]): OSubscription[] {
    if (DataHelper.isNotEmptyArray(subscriptions)) {
      return subscriptions.map((sub) => StoreFactory.getSubscription(sub));
    }
    return [];
  }
}
