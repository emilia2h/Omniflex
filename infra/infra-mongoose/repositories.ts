import { BaseRepository } from './repositories/base';
import { RawRepository } from './repositories/raw-repository';

import {
  TDeepPartial,
  TQueryOptions,
  IBaseRepository,
} from '@omniflex/core/types';

export class MongooseBaseRepository<T, TPrimaryKey = string>
  extends BaseRepository<T>
  implements IBaseRepository<T, TPrimaryKey> {
  raw() {
    return new RawRepository(this.model, {
      ...this.options,
    });
  }

  async exists(filter: TDeepPartial<T>): Promise<boolean> {
    const count = await this.model.countDocuments(
      filter,
      this.sharedQueryOptions,
    );

    return count > 0;
  }

  findById(id: TPrimaryKey, options?: TQueryOptions<T>): Promise<T | null> {
    return this.model.findById(
      id,
      null,
      this.transformQueryOptions(options)
    );
  }

  findOne(filter: TDeepPartial<T>, options?: TQueryOptions<T>): Promise<T | null> {
    return this.model.findOne(
      filter,
      null,
      this.transformQueryOptions(options)
    );
  }

  find(filter: TDeepPartial<T>, options?: TQueryOptions<T>): Promise<T[]> {
    return this.model.find(
      filter,
      null,
      this.transformQueryOptions(options)
    );
  }

  create(data: Partial<T>): Promise<T> {
    const query = this.model.create(data);

    return this.noAutoLean ? query :
      query.then(result => result.toObject());
  }

  update(id: TPrimaryKey, data: Partial<T>): Promise<T | null> {
    return this.model.findByIdAndUpdate(
      id,
      data,
      {
        ...this.sharedQueryOptions,
        new: true,
      }
    );
  }

  async delete(id: TPrimaryKey): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(id);

    return !!result;
  }

  async softDelete(id: TPrimaryKey): Promise<boolean> {
    const result = await this.model.findByIdAndUpdate(id, { isDeleted: true });

    return !!result;
  }

  protected transformQueryOptions<T>(options?: TQueryOptions<T>) {
    if (!options) return this.sharedQueryOptions;

    const transformed = {
      ...this.sharedQueryOptions,
      skip: options.skip,
      limit: options.take,
      sort: options.sort,
    };

    if (options.select) {
      transformed['select'] = options.select.join(' ');
    }

    if (options.populate) {
      transformed['populate'] = options.populate;
    }

    return transformed;
  }
}