import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
  ManyToMany,
} from "typeorm"
import { Role } from "./role.entity"
import { BaseEntity, LocalDateTransformer } from './_base.entity'

@Entity({ name: "permissions" })
@Unique(["name", "guard_name"])
export class Permission extends BaseEntity {
  @PrimaryGeneratedColumn("increment")
  id: number

  @Column("varchar")
  name: string

  @Column("varchar")
  guard_name: string

  @CreateDateColumn({
    type: "timestamp",
    select: false,
    transformer: new LocalDateTransformer()
  })
  created_at: Date

  @UpdateDateColumn({
    type: "timestamp",
    select: false,
    transformer: new LocalDateTransformer()
  })
  updated_at: Date

  @ManyToMany(() => Role, (role) => role.permissions)
  roles?: Role[]
}
