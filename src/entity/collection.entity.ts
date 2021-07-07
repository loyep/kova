import { Column, CreateDateColumn, Entity } from 'typeorm'
import { BaseEntity } from './_base.entity'

@Entity({ name: 'collections' })
export class Collection extends BaseEntity {
  @Column('varchar', { primary: true })
  type: string

  @Column('bigint', { unsigned: true, primary: true })
  collection_id: number

  @Column('int', { unsigned: true, primary: true })
  user_id: number

  @CreateDateColumn()
  created_at: Date
}
