/* eslint-disable @typescript-eslint/no-unused-vars */
import { ISubscription, OSubscription } from '../model/subscription.model';
import { IUpdateStoreDTO } from '../../subscription/store.service.interface';
import { ICreateStoreDTO } from '../../subscription/store.service.interface';
import { StaffFactory } from './staff.factory';
import { DataHelper } from '../../../_shared/adapter/helper/data.helper';

export abstract class StoreFactory {
  static create(data: ICreateStoreDTO): ISubscription {
    const store = new ISubscription();
    store.client = data.client;
    store.address = data.address;
    store.gps = data.gps;
    store.name = data.name;
    store.isDefault = data.isDefault ?? false;

    return store;
  }

  static update(store: ISubscription, data: IUpdateStoreDTO): ISubscription {
    // fais la modification des données de store avec le data
    store.name = data.name ?? store.name;
    store.address = data.address ?? store.address;
    store.gps = data.gps ?? store.gps;

    return store;
  }

  static getStore(store: ISubscription): OSubscription {
    if (store) {
      return {
        id: store.id,
        name: store.name,
        address: store.address,
        gps: store.gps,
        isDefault: store.isDefault,
        isActivated: store.isActivated,
        client: StaffFactory.getClient(store.client!),
        createdAt: store.createdAt,
        updatedAt: store.updatedAt,
      };
    }
    return null as any;
  }
  static getStores(stores: ISubscription[]): OSubscription[] {
    if (DataHelper.isNotEmptyArray(stores)) {
      return stores.map((store) => StoreFactory.getStore(store));
    }
    return [];
  }
}
