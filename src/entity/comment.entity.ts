import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm"
import { Article } from "./article.entity"
import { BaseEntity, LocalDateTransformer } from "./_base.entity"

@Entity({ name: "comments" })
export class Comment extends BaseEntity {
  /**
   * 评论id
   */
  @PrimaryGeneratedColumn("increment")
  id: number

  @Column("varchar", {})
  content: string

  @Column("int")
  user_id: number

  @Column("varchar", { nullable: true })
  url: string

  @Column("varchar", { nullable: true })
  email: string

  @Column("bigint", { unsigned: true })
  article_id: string

  @Column("varchar", { nullable: true })
  ip: string

  @ManyToOne(() => Article, (article: Article) => article.comments)
  @JoinColumn({ name: "article_id" })
  article: Promise<Article>

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
