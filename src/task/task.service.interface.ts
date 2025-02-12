import { ISubscription } from "admin/_shared/model/subscription.model";

export abstract class ITaskService {
  abstract addSubscriptionExpiryCron(subscription: ISubscription): void;
}
