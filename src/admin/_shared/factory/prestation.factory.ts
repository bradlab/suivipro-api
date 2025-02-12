/* eslint-disable @typescript-eslint/no-unused-vars */
import { Prestation, OPrestation } from '../model/prestation.model';
import { IUpdatePrestationDTO } from '../../prestation/prestation.service.interface';
import { ICreatePrestationDTO } from '../../prestation/prestation.service.interface';
import { SubscriptionFactory } from './subscription.factory';
import { DataHelper } from 'adapter/helper/data.helper';

export abstract class PrestationFactory {
  static create(data: ICreatePrestationDTO): Prestation {
    const prestation = new Prestation();
    prestation.price = data.price;
    prestation.name = data.name;
    prestation.images = data.images;
    prestation.description = data.description;

    return prestation;
  }

  static update(prestation: Prestation, data: IUpdatePrestationDTO): Prestation {
    // fais la modification des données de annonce avec le data
    prestation.price = data.price ?? prestation.price;
    prestation.images = data.images ?? prestation.images;
    prestation.name = data.name ?? prestation.name;
    prestation.description = data.description ?? prestation.description;

    return prestation;
  }

  static getPrestation(prestation: Prestation): OPrestation {
    if (prestation) {
      return {
        id: prestation.id,
        description: prestation.description,
        name: prestation.name,
        price: prestation.price,
        isActivated: prestation.isActivated,
        images: DataHelper.getFileLinks(prestation.images!),
        subscriptions: SubscriptionFactory.getSubscriptions(prestation.subscriptions),
        createdAt: prestation.createdAt,
        updatedAt: prestation.updatedAt,
      };
    }
    return null as any;
  }
}
