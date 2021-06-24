import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  DeleteDateColumn,
  AfterLoad,
  BaseEntity,
} from "typeorm"

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

  @Column("bigint", { unsigned: true })
  article_id: number

  @CreateDateColumn({ type: "timestamp", select: false })
  start_at: Date

  @DeleteDateColumn({ type: "timestamp", select: false })
  end_at: Date

  @AfterLoad()
  onAfterEntityLoad() {
    //
  }
}
