export type TSoftDeletable = {
  isDeleted: boolean;
};

export type TWithTimestamps = {
  createdAt: Date;
  updatedAt: Date;
};

export type TQueryOperators<T> = {
  $eq?: T
  $ne?: T
  $gt?: T
  $gte?: T
  $lt?: T
  $lte?: T
  $in?: T[]
  $nin?: T[]
  $regex?: string | RegExp
  $options?: string
}

export type TQueryCondition<T> = T | TQueryOperators<T>

export type TDeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? TDeepPartial<T[P]> | TQueryCondition<T[P]> : TQueryCondition<T[P]>
}

export type TQueryOptions<T> = {
  select?: Array<keyof T>
  populate?: Array<keyof T>
  skip?: number
  take?: number
  sort?: {
    [P in keyof T]?: 'asc' | 'desc'
  }
}

export interface IBaseRepository<T, TPrimaryKey> {
  exists(filter: TDeepPartial<T>): Promise<boolean>

  findById(id: TPrimaryKey, options?: TQueryOptions<T>): Promise<T | null>
  findOne(filter: TDeepPartial<T>, options?: TQueryOptions<T>): Promise<T | null>
  find(filter: TDeepPartial<T>, options?: TQueryOptions<T>): Promise<T[]>

  create(data: Partial<T>): Promise<T>
  update(id: TPrimaryKey, data: Partial<T>): Promise<T | null>

  delete(id: TPrimaryKey): Promise<boolean>
  softDelete(id: TPrimaryKey): Promise<boolean>
}