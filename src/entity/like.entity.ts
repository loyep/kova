import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm"
import { BaseEntity, LocalDateTransformer } from "./_base.entity"

@Entity({ name: "likes" })
export class Like extends BaseEntity {
  @PrimaryGeneratedColumn("increment")
  id: number

  @Column("varchar")
  type: string

  @Column("bigint", { unsigned: true })
  like_id: number

  @Column("bigint", { unsigned: true })
  user_id: number

  @CreateDateColumn({ 
    type: "timestamp",
    select: false,
    transformer: new LocalDateTransformer()
   })
  created_at: Date
}
