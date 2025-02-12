import {
  DeepQueryType,
  PartialDeep,
  PartialDeepBool,
  PartialDeepOrder,
} from 'domain/types';

export interface RepoParam<T> {
  relations?: PartialDeepBool<T>;
  select?: PartialDeepBool<T>;
  where?: DeepQueryType<T> | DeepQueryType<T>[];
  withDeleted?: boolean;
  order?: PartialDeepOrder<T>;
  skip?: number;
  take?: number;
}
export abstract class IGenericRepository<T> {
  abstract findBy(options: DeepQueryType<T>): Promise<T[]>;

  abstract find(options?: RepoParam<T>): Promise<T[]>;

  abstract findOneByID(id: string, options?: RepoParam<T>): Promise<T>;

  abstract findByIds(ids: string[], options?: DeepQueryType<T>): Promise<T[]>;

  abstract findOneBy(options: DeepQueryType<T>): Promise<T>;

  abstract findForLogin(options: PartialDeep<T>): Promise<T>;

  abstract findOne(options: RepoParam<T>): Promise<T>;

  abstract create(options: T): Promise<T>;

  abstract createMany(items: T[]): Promise<T[]>;

  abstract updateMany(items: T[]): Promise<T[]>;

  abstract update(item: T): Promise<T>;

  abstract clean(item: T | T[]): Promise<T | T[]>;

  abstract removeMany(item: T[]): Promise<T[]>;

  abstract remove(item: T): Promise<T>;
}
export abstract class IFindGeneric<T> {
  abstract findBy(options: DeepQueryType<T>): Promise<T[]>;

  abstract find(options?: RepoParam<T>): Promise<T[]>;

  abstract findByIds(ids: string[], options?: DeepQueryType<T>): Promise<T[]>;
}
export abstract class IFindOneGeneric<T> {
  abstract findOneByID(id: string, options?: DeepQueryType<T>): Promise<T>;

  abstract findOneBy(options: DeepQueryType<T>): Promise<T>;

  abstract findForLogin(options: PartialDeep<T>): Promise<T>;

  abstract findOne(options: RepoParam<T>): Promise<T>;
}

export abstract class ICreateGeneric<T> {
  abstract create(options: T): Promise<T>;

  abstract createMany(items: T[]): Promise<T[]>;
}
export abstract class IUpdateGeneric<T> {
  abstract updateMany(items: T[]): Promise<T[]>;

  abstract update(item: T): Promise<T>;
}
export abstract class IRemoveGeneric<T> {
  abstract clean(item: T | T[]): Promise<T | []>;

  abstract removeMany(item: T[]): Promise<T[]>;

  abstract remove(item: T): Promise<T>;
}
