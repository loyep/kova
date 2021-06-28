import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"
import { BaseEntity } from "~/entity/_base.entity"

@Entity({ name: "settings" })
export class Setting extends BaseEntity {
  @PrimaryGeneratedColumn("increment")
  id: number

  @Column("varchar", { unique: true })
  key: string

  @Column("varchar")
  display_name: string

  @Column("text", { nullable: true })
  value: string

  @Column("varchar", { nullable: true })
  type: string

  @Column("text", { nullable: true, select: false })
  details: string

  @Column("int", { default: 1 })
  order: number
}
