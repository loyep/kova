import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  DeleteDateColumn,

  ManyToMany,
} from "typeorm"
import { Article } from "./article.entity"
import { BaseEntity, LocalDateTransformer } from './_base.entity'

export interface TopicMeta {
  cover: string
  color: string
  background: string
}

export const defaultMeta: TopicMeta = {
  cover: "",
  background: "",
  color: "",
}

@Entity({
  name: "topics",
  orderBy: {
    id: "DESC",
  },
})
export class Topic extends BaseEntity {
  @PrimaryGeneratedColumn("increment")
  id: number

  @Column("varchar")
  name: string

  @Column("varchar", { unique: true })
  slug: string

  @Column("tinytext", { nullable: true, default: null })
  description?: string

  @Column("varchar", { nullable: true, default: null })
  image: string | null

  @Column("simple-json", { default: null, select: true })
  meta: TopicMeta

  @Column("int", { name: "articles_count", unsigned: true, default: 0 })
  articles_count: number

  @ManyToMany(() => Article, (article: Article) => article.topics)
  articles: Promise<Article[]>

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
}
