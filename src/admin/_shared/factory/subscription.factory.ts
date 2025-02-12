/* eslint-disable @typescript-eslint/no-unused-vars */
import { ISubscription, OSubscription } from '../model/subscription.model';
import { ICreateSubscriptionDTO } from '../../subscription/subscription.service.interface';
import { DataHelper } from '../../../_shared/adapter/helper/data.helper';
import { ClientFactory } from './client.factory';
import { PrestationFactory } from './prestation.factory';

export abstract class SubscriptionFactory {
  static create(data: ICreateSubscriptionDTO): ISubscription {
    const subscription = new ISubscription();
    subscription.client = data.client;
    subscription.prestation = data.prestation;
    subscription.type = data.type;
    subscription.startAt = new Date();

    return subscription;
  }

  static getSubscription(subscription: ISubscription): OSubscription {
    if (subscription) {
      return {
        id: subscription.id,
        closedAt: subscription.closedAt,
        isActivated: subscription.isActivated,
        prestation: PrestationFactory.getPrestation(subscription.prestation!),
        client: ClientFactory.getClient(subscription.client!),
        createdAt: subscription.createdAt,
        updatedAt: subscription.updatedAt,
      };
    }
    return null as any;
  }
  static getSubscriptions(subscriptions: ISubscription[]): OSubscription[] {
    if (DataHelper.isNotEmptyArray(subscriptions)) {
      return subscriptions.map((sub) => SubscriptionFactory.getSubscription(sub));
    }
    return [];
  }
}
