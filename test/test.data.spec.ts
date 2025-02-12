import { faker } from '@faker-js/faker/.';
import { ICreateAnnonceDTO } from 'admin/prestation/annonce.service.interface';
import { Staff } from 'admin/_shared/model/staff.model';
import { ICreateStaffDTO } from 'admin/auth/auth.service.interface';
import { Prestation } from 'admin/_shared/model/annonce.model';
import {
  Transaction,
  TransactionTypeEnum,
} from 'admin/_shared/model/transaction.model';
import { IUpdatePointDTO } from 'admin/transaction/point.service.interface';
import { ICreateStoreDTO } from 'admin/subscription/store.service.interface';
import { ISubscription } from 'admin/_shared/model/subscription.model';

export const ANNONCE_DATA: ICreateAnnonceDTO = {
  title: faker.commerce.productName(),
  description: faker.commerce.productDescription(),
  quantity: 100,
  tags: ['tuyaux'],
  price: 50,
  images: []
};

export const ANNONCE_MODEL_DATA: Partial<Prestation> = {
  id: faker.string.uuid(),
  description: faker.commerce.productDescription(),
  quantity: faker.number.int({ min: 100, max: 1000 }),
  tags: ['tuyaux'],
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

export const POINT_DATA: IUpdatePointDTO = {
  points: faker.number.int({ min: 1, max: 100 }),
  clientID: faker.string.uuid(),
  type: faker.helpers.enumValue(TransactionTypeEnum),
};
export const POINT_MODEL_DATA: Partial<Transaction> = {
  id: faker.string.uuid(),
  points: faker.number.int({ min: 1, max: 100 }),
  client: CLIENT_MODEL_DATA as Staff,
  type: faker.helpers.enumValue(TransactionTypeEnum),
  createdAt: faker.date.past(),
  updatedAt: faker.date.past(),
};
export const STORE_DATA: ICreateStoreDTO = {
  name: faker.company.name(),
  address: faker.location.streetAddress(),
  gps: { lat: faker.location.latitude(), lng: faker.location.longitude() },
};
export const STORE_MODEL_DATA: Partial<ISubscription> = {
  id: faker.string.uuid(),
  name: faker.company.name(),
  address: faker.location.streetAddress(),
  gps: { lat: faker.location.latitude(), lng: faker.location.longitude() },
  isActivated: faker.datatype.boolean(),
  isDefault: faker.datatype.boolean(),
  createdAt: faker.date.past(),
  updatedAt: faker.date.past(),
};
