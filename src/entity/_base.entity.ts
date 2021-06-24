import { BaseEntity as TypeormEntity } from "typeorm"
export { LocalDateTransformer, MetaTransformer } from '@/core/database/transformer';

export class ListResult<T> {
  list: T[]
  meta: {
    count: number
    page: number
    pageSize: number
    totalPage: number
  }
}

export class BaseEntity extends TypeormEntity {

  // public static factory<T extends BaseEntity>(this: ObjectType<T>, init: DeepPartial<T>): T {
    // return Object.assign(Object.create(this.prototype), init);
  // }
}
