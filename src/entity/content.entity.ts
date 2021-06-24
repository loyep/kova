import {
    Column,
    Entity,
    JoinColumn,
    PrimaryGeneratedColumn,
    OneToOne,
} from "typeorm"
import { BaseEntity, } from "./_base.entity"
import { Article } from "./article.entity"


@Entity({
    name: "contents",
})
export class Content extends BaseEntity {
    /**
     * 主键
     */
    @PrimaryGeneratedColumn({
        type: "bigint",
        unsigned: true,
    })
    id: number | string

    /**
     * 内容
     */
    @Column("mediumtext", { nullable: true, comment: "文章内容" })
    content: string

    @Column("mediumtext", { nullable: true, comment: "markdown" })
    markdown: string

    @Column('bigint', {
        unsigned: true
    })
    article_id: string | number

    /**
     * 文章
     */
    @OneToOne(() => Article, (article: Article) => article.content)
    @JoinColumn({ name: "article_id" })
    article: Promise<Article> | null
}
