import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm"
import { Article } from "@/entity/article.entity"
import { BaseEntity, LocalDateTransformer } from './_base.entity'

export interface TagMeta {
  cover: string
  color: string
  background: string
}

export const defaultMeta: TagMeta = {
  cover: "",
  background: "",
  color: "",
}

@Entity({ name: "tags" })
export class Tag extends BaseEntity {
  @PrimaryGeneratedColumn("increment")
  id: number

  @Column("varchar")
  @Index({ unique: true })
  name: string

  @Column("varchar")
  @Index({ unique: true })
  slug: string

  @Column("tinytext", { nullable: true, default: null })
  description?: string

  @Column("varchar", { nullable: true, default: null })
  image: string | null

  @Column("simple-json", { default: null, select: true })
  meta: TagMeta

  @Column("int", { name: "articles_count", unsigned: true, default: 0 })
  articles_count: number

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

  @ManyToMany(() => Article, (article: Article) => article.tags)
  articles: Promise<Article[]>
}
