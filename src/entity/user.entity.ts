import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToMany,
  JoinTable,
} from "typeorm"
import { Article } from "~/entity/article.entity"
import { BaseEntity, LocalDateTransformer } from './_base.entity'

export interface UserMeta {
  cover: string
  color: string
  background: string
}

export const defaultMeta: UserMeta = {
  cover: "",
  background: "",
  color: "",
}

export enum UserStatus {
  inactivated = "inactivated",
  active = "active",
  frozen = "frozen",
}

@Entity({
  name: "users",
})
export class User extends BaseEntity {
  @PrimaryGeneratedColumn("increment", { type: "bigint" })
  id: number

  @Column("varchar", { length: 60 })
  login: string

  @Column("varchar", { length: 50 })
  email: string

  @Column("varchar", { nullable: true, default: null })
  name: string

  @Column("varchar", { nullable: true, default: null })
  url: string

  @Column("simple-json", { default: null, select: true })
  meta: UserMeta

  @Column("varchar", { nullable: true, default: null })
  avatar: string

  @Column("varchar", { nullable: true, default: null })
  image: string

  @Column("varchar", { nullable: true, default: null, select: false })
  cover: string

  @Column("varchar", { default: UserStatus.inactivated })
  status: string

  @Column("varchar", { nullable: true, default: null })
  bio: string

  @Column("varchar", { nullable: true, default: null, length: 512 })
  description: string

  @Column("varchar", {
    nullable: true,
    default: null,
    length: 20,
    select: false,
  })
  mobile: string

  @Column("varchar", { select: false })
  password: string

  @Column("timestamp", {
    nullable: true,
    select: false,
    default: null,
    transformer: new LocalDateTransformer()
  })
  logged_at: Date

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

  @DeleteDateColumn({
    type: "timestamp",
    select: false,
    transformer: new LocalDateTransformer()
  })
  deleted_at: Date

  @OneToMany(() => Article, (article: Article) => article.user)
  articles: Promise<Article[]>

  @ManyToMany(() => User, (user: User) => user.followings)
  @JoinTable({
    name: "follows",
    joinColumns: [{ name: "user_id" }],
    inverseJoinColumns: [{ name: "follower_id" }],
  })
  followers: Promise<User[]>

  @ManyToMany(() => User, (user: User) => user.followers)
  followings: Promise<User[]>
}
