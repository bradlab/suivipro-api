/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { In, ObjectLiteral, Repository } from 'typeorm';
import { IGenericRepository } from 'domain/abstract';

export class DBGenericRepository<T extends ObjectLiteral> implements IGenericRepository<T> {
  private _repository: Repository<T>;

  constructor(repository: Repository<T>) {
    this._repository = repository;
  }

  find(options?: any): Promise<T[]> {
    return this._repository.find(options);
  }

  findBy(options: any): Promise<T[]> {
    return this._repository.find({ ...options });
  }

  async findOneByID(id: string, options?: any): Promise<T> {
    options = { ...options, id };
    return await this._repository.findOne({ where: { ...options } }) ?? null as any;
  }

  async findByIds(ids: string[], options?: any): Promise<T[]> {
    const customQuery: any = { id: In(ids), ...options };
    if (ids?.length > 0) {
      return await this._repository.findBy({ ...customQuery });
    }
    return [];
  }

  async findOne(options: any): Promise<T> {
    return await this._repository.findOne({ ...options }) ?? null as any;
  }

  async findForLogin(options: any): Promise<T> {
    return await this._repository.findOne({
      ...options,
      select: { ...options?.select, password: true },
    })  ?? null as any;
  }

  async findOneBy(options: any): Promise<T> {
    return await this._repository.findOneBy(options) ?? null as any;
  }

  async create(item: T): Promise<T> {
    return this._repository.save(item);
  }

  async createMany(items: T[]): Promise<T[]> {
    return this._repository.save(items);
  }

  async updateMany(items: T[]) {
    return this._repository.save(items);
  }

  async update(item: T) {
    return this._repository.save(item);
  }

  async clean(items: any): Promise<any> {
    // This method remove permanently
    return this._repository.remove(items);
  }

  async removeMany(items: T[]): Promise<T[]> {
    return this._repository.softRemove(items);
  }

  async remove(item: T): Promise<T> {
    return this._repository.softRemove(item);
  }
}
