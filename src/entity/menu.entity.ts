import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm"
import { BaseEntity, LocalDateTransformer } from "./_base.entity"

@Entity({ name: "menus" })
export class Like extends BaseEntity {
  @PrimaryGeneratedColumn("increment")
  id: number

  @Column("varchar")
  type: string

  @Column("varchar")
  title: string

  @Column("varchar", { nullable: true })
  rel: string

  @Column("varchar", { nullable: true })
  target: string

  @Column("varchar")
  url: string

  @CreateDateColumn({
    type: "timestamp",
    select: false,
    transformer: new LocalDateTransformer()
  })
  created_at: Date
}
