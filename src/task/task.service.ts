import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob, CronTime } from 'cron';

import { ITaskService } from './task.service.interface';
import { DataHelper } from 'adapter/helper/data.helper';
import { ISubscriptionService } from 'admin/subscription/subscription.service.interface';
import { ISubscription } from 'admin/_shared/model/subscription.model';

@Injectable()
export class TaskService implements ITaskService, OnApplicationBootstrap {
  private readonly logger = new Logger(TaskService.name);
  constructor(
    private readonly schedulerRegistry: SchedulerRegistry,

    private subscriptionService: ISubscriptionService,
  ) {}

  onApplicationBootstrap(): void {
    void this.trackPrestationSubscription();
  }

  addSubscriptionExpiryCron(subscription: ISubscription): void {
    try {
      if (subscription) {
        if (subscription.dueDate) {
          const job = new CronJob(subscription.dueDate, async () => {
            this.logger.warn(
              `CRON::subscription.expiration ${subscription.dueDate}`,
            );
            subscription.isActivated = false;
            void this.subscriptionService.editManySubscriptions([
              subscription,
            ]);
          });
  
          this.schedulerRegistry.addCronJob(
            `subscription-${subscription.id}`,
            job,
          );
  
          if (this._existedCronJob(`subscription-${subscription.id}`)) {
            job.setTime(new CronTime(subscription.dueDate));
          } else {
            job.start();
          }
        }
      } else {

      }
    } catch (error) {
      this.logger.error(error, 'ERROR::TaskService.addSubscriptionExpiryCron');
      // throw error;
    }
  }


  async trackPrestationSubscription(): Promise<void> {
    const subscriptions =
      await this.subscriptionService.fetchAll({
        isValid: true,
      });
    if (DataHelper.isNotEmptyArray(subscriptions)) {
      const subList = subscriptions
        .map((subscription) => {
          if (subscription) {
            if (
              !subscription.dueDate ||
              subscription.dueDate <= new Date()
            ) {
              if (subscription.isActivated) {
                subscription.isActivated = false;
                return subscription;
              }
            } else {
              this.addSubscriptionExpiryCron(subscription);
            }
          }
        })
        .filter(Boolean);
      if (DataHelper.isNotEmptyArray(subList)) {
        this.logger.warn(
          `SUBSCRIPTIONS::EXPIRED ${subList?.length}`,
          'TaskService.trackPrestationSubscription',
        );
        void this.subscriptionService.editManySubscriptions(subList as any);
      }
    }
  }

  private _existedCronJob(name: string): boolean {
    return this.schedulerRegistry.getCronJob(name).running;
  }
}
