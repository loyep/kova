import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  Index,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  DeleteDateColumn,
  OneToOne,
} from "typeorm"
import { Category } from "./category.entity"
import { User } from "./user.entity"
import { Tag } from "./tag.entity"
import { Comment } from "./comment.entity"
import { Topic } from "./topic.entity"
import {
  BaseEntity, LocalDateTransformer,
  MetaTransformer
} from "./_base.entity"
import { Transform } from "class-transformer"
import { Content } from "./content.entity"

export interface ArticleMetaType {
  cover: string
  color: string
  background: string
}

export function defaultMeta(): ArticleMetaType {
  return {
    cover: "",
    background: "",
    color: "",
  }
}

export enum ArticleStatusType {
  PUBLISHED = "published",
  PRIVATE = "private",
  PASSWORD = "password",
  DRAFT = "draft",
}

export enum ArticleCommentType {
  ALLOW = "allow",
  REFUSE = "refuse",
  COMMENTED = "commented",
  LOGGED = "logged",
}

@Entity({
  name: "articles",
  orderBy: {
    id: 'DESC'
  }
})
export class Article extends BaseEntity {
  /**
   * 主键
   */
  @PrimaryGeneratedColumn({
    type: "bigint",
    unsigned: true,
  })
  id: number | string

  /**
   * 文章标题
   */
  @Column("varchar", { default: "" })
  @Index()
  title: string

  /**
   * 文章状态
   */
  @Column("enum", {
    enum: ArticleStatusType,
    default: ArticleStatusType.DRAFT,
    comment: "文章状态",
  })
  status: ArticleStatusType

  @Column("tinyint", { width: 1, default: true, comment: "是否公开 [1 - 公开, 0 - 私密]" })
  @Index()
  public: boolean

  /**
   * 文章路径
   */
  @Column("varchar", { comment: "文章路径" })
  @Index({ unique: true })
  slug: string

  @Column("varchar", { default: "", comment: "文章图" })
  image: string | null

  @Column("varchar", { default: "", comment: "摘要" })
  excerpt: string

  @Column("simple-json", {
    nullable: true,
    select: true,
    comment: "扩展信息",
    transformer: new MetaTransformer(defaultMeta())
  })
  meta: ArticleMetaType

  @Column("tinytext", { nullable: true, comment: "文章头图" })
  @Transform(({ value }) => value || "https://aiecho.cn/images/demo-1.jpg", { toPlainOnly: true, toClassOnly: false })
  cover: string | null

  /**
   * 阅读数
   */
  @Column("int", { unsigned: true, default: 0, comment: "阅读数" })
  browse_count: number

  /**
   * 点赞数
   */
  @Column("int", { unsigned: true, default: 0, comment: "点赞数" })
  likes_count: number

  /**
   * 评论数
   */
  @Column("int", { unsigned: true, default: 0, comment: "评论数" })
  comments_count: number

  /**
   * 评论类型
   */
  @Column("enum", {
    enum: ArticleCommentType,
    default: ArticleCommentType.ALLOW,
    comment: "评论类型",
  })
  comment_type: ArticleCommentType

  @Column("timestamp", {
    default: () => 'CURRENT_TIMESTAMP',
    comment: "发布时间",
    transformer: new LocalDateTransformer(),
  })
  @Index()
  published_at: Date | null

  /**
   * 分类id
   */
  @Column("bigint", { default: 0, comment: "分类id" })
  @Index()
  category_id: number

  /**
   * 分类
   */
  @ManyToOne(() => Category, (category: Category) => category.articles)
  @JoinColumn({ name: "category_id" })
  category: Category

  /**
   * 作者id
   */
  @Column("bigint", { default: 0, comment: "作者id" })
  user_id: number

  /**
   * 作者
   */
  @ManyToOne(() => User, (user: User) => user.articles)
  @JoinColumn({ name: "user_id" })
  user: User

  /**
   * 文章标签
   */
  @ManyToMany(() => Tag, (tag: Tag) => tag.articles)
  @JoinTable({
    name: "article_tags",
    joinColumn: { name: "article_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "tag_id", referencedColumnName: "id" },
  })
  tags: Promise<Tag[]>

  /**
   * 专题
   */
  @ManyToMany(() => Topic, (topic: Topic) => topic.articles)
  @JoinTable({
    name: "article_topics",
    joinColumn: { name: "article_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "topic_id", referencedColumnName: "id" },
  })
  topics: Promise<Topic[]>

  /**
   * 文章评论
   */
  @OneToMany(() => Comment, (comment: Comment) => comment.article)
  comments: Comment[]

  @CreateDateColumn({
    select: false,
    type: "timestamp",
    transformer: new LocalDateTransformer()
  })
  created_at: Date | string

  @UpdateDateColumn({
    select: false,
    type: "timestamp",
    transformer: new LocalDateTransformer()
  })
  updated_at: Date | string

  prev?: Article | null

  next?: Article | null

  /**
   * 文章内容
   */
  @OneToOne(() => Content, (content: Content) => content.article)
  content: Content

  @DeleteDateColumn({
    type: "timestamp",
    select: false,
    transformer: new LocalDateTransformer(),
    default: null,
    nullable: true
  })
  @Index()
  deleted_at: Date
}
