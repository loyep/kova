import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from "typeorm"
import { Permission } from "./permission.entity"
import { BaseEntity, LocalDateTransformer } from './_base.entity'

@Entity({ name: "roles" })
@Unique(["name", "guard_name"])
export class Role extends BaseEntity {
  @PrimaryGeneratedColumn("increment")
  id: number

  @Column("varchar")
  name: string

  @Column("varchar", {})
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

  @ManyToMany(() => Permission, (permission) => permission.roles)
  @JoinTable({
    name: "permission_roles",
    joinColumn: { name: "role_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "permission_id", referencedColumnName: "id" },
  })
  permissions?: Permission[]
}
