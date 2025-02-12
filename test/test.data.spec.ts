import { faker } from '@faker-js/faker/.';
import { ICreatePrestationDTO } from 'admin/prestation/prestation.service.interface';
import { Staff } from 'admin/_shared/model/staff.model';
import { ICreateStaffDTO } from 'admin/auth/auth.service.interface';
import { Prestation } from 'admin/_shared/model/prestation.model';
import {
  Transaction,
  SubscriptionTypeEnum,
} from 'admin/_shared/model/transaction.model';
import { ISubscribePrestation } from 'admin/transaction/transaction.service.interface';
import { ICreateSubscriptionDTO } from 'admin/subscription/subscription.service.interface';
import { ISubscription } from 'admin/_shared/model/subscription.model';

export const ANNONCE_DATA: ICreatePrestationDTO = {
  name: faker.commerce.productName(),
  description: faker.commerce.productDescription(),
  price: 50,
  images: []
};

export const ANNONCE_MODEL_DATA: Partial<Prestation> = {
  id: faker.string.uuid(),
  description: faker.commerce.productDescription(),
  price: 50,
  createdAt: faker.date.past(),
  updatedAt: faker.date.past(),
};

export const CLIENT_DATA: ICreateStaffDTO = {
  firstname: faker.person.firstName(),
  lastname: faker.person.lastName(),
  email: faker.internet.email(),
  phone: faker.phone.number(),
  address: faker.location.streetAddress(),
  country: faker.location.country(),
};

export const CLIENT_MODEL_DATA: Partial<Staff> = {
  id: faker.string.uuid(),
  firstname: faker.person.firstName(),
  lastname: faker.person.lastName(),
  email: faker.internet.email(),
  phone: faker.phone.number(),
  address: faker.location.streetAddress(),
  country: faker.location.country(),
  createdAt: faker.date.past(),
  updatedAt: faker.date.past(),
};

export const POINT_DATA: ISubscribePrestation = {
  amount: faker.number.int({ min: 1, max: 100 }),
  clientID: faker.string.uuid(),
  type: faker.helpers.enumValue(SubscriptionTypeEnum),
};
export const POINT_MODEL_DATA: Partial<Transaction> = {
  id: faker.string.uuid(),
  amount: faker.number.int({ min: 1, max: 100 }),
  client: CLIENT_MODEL_DATA as Staff,
  type: faker.helpers.enumValue(SubscriptionTypeEnum),
  createdAt: faker.date.past(),
  updatedAt: faker.date.past(),
};
export const STORE_DATA: ICreateSubscriptionDTO = {
  // name: faker.company.name(),
  client: null as any,
  prestation: null as any,
};
export const STORE_MODEL_DATA: Partial<ISubscription> = {
  id: faker.string.uuid(),
  isActivated: faker.datatype.boolean(),
  createdAt: faker.date.past(),
  updatedAt: faker.date.past(),
};
