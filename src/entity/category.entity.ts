import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  UpdateDateColumn,
  CreateDateColumn,
  Index,
  DeleteDateColumn,
} from "typeorm"
import { Article } from "@/entity/article.entity"
import { BaseEntity, MetaTransformer } from "@/entity/_base.entity"

export interface CategoryMeta {
  cover: string
  color: string
  background: string
}

export const defaultMeta: CategoryMeta = {
  cover: "",
  background: "",
  color: "",
}

@Entity({
  name: "categories",
})
export class Category extends BaseEntity {
  @PrimaryGeneratedColumn("increment")
  id: number

  /**
   * 分类名
   */
  @Column("varchar")
  name: string

  /**
   * 分类路径
   */
  @Column("varchar")
  @Index({ unique: true })
  slug: string

  /**
   * 描述
   */
  @Column("tinytext", { nullable: true, default: null })
  description?: string

  /**
   * 分类图
   */
  @Column("varchar", { nullable: true, default: null })
  image: string | null

  @Column("simple-json", { default: null, select: true, transformer: new MetaTransformer(defaultMeta) })
  meta: CategoryMeta

  @Column("int", { name: "articles_count", unsigned: true, default: 0 })
  articles_count: number

  @OneToMany(() => Article, (article: Article) => article.category)
  articles: Promise<Article[]>

  @CreateDateColumn({ type: "timestamp", select: false })
  created_at: Date

  @UpdateDateColumn({ type: "timestamp", select: false })
  updated_at: Date

  @DeleteDateColumn({ type: "timestamp", select: false })
  @Index()
  deleted_at: Date
}
