import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  DeleteDateColumn,
} from "typeorm"
import { BaseEntity, LocalDateTransformer, MetaTransformer } from "./_base.entity"

export interface PostMeta {
  cover: string
  color: string
  background: string
}

export function defaultMeta(): PostMeta {
  return {
    cover: "",
    background: "",
    color: "",
  }
}

@Entity({
  name: "article_tokens",
  orderBy: {
    id: "DESC",
  },
})
export class ArticleToken extends BaseEntity {
  @PrimaryGeneratedColumn("increment")
  id: number

  @Column("int", { unsigned: true })
  articleId: number

  @CreateDateColumn({
    type: "timestamp",
    select: false,
    transformer: new LocalDateTransformer()
  })
  start_at: Date

  @DeleteDateColumn({
    type: "timestamp",
    select: false,
    transformer: new LocalDateTransformer()
  })
  end_at: Date
}
