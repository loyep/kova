import { InjectRepository } from "@nestjs/typeorm"
import { LessThan, MoreThan, Not, Repository, SelectQueryBuilder } from "typeorm"
import { Article, ArticleStatusType } from "~/entity/article.entity"
import { defaultMeta } from "~/entity/article.entity"
import { Injectable } from "@nestjs/common"
import { IPaginatorOptions, paginate, resolveOptions, createPaginationObject } from "~/core/common/paginate"
import { CreateArticleDto } from "./dto/create-article.dto"
import { UpdateArticleDto } from "./dto/update-article.dto"
import { MyHttpException } from "~/core/exceptions/my-http.exception"
import { ErrorCode } from "~/constants/error"
import { getColumnNames } from "~/core/database/repository"
import { Category } from "~/entity/category.entity"
import { IPaginationOptions } from "~/core/common/paginate/paginate.interface"
import { User } from "~/entity/user.entity"
import { isEmpty } from "lodash"
import { Content } from "~/entity/content.entity"

const mergeItems = <T = any>(items: T[], joinItems: any[], keyPath: string, propertyName: string, joinKeyPath: string = 'id') => {
  if (isEmpty(items) || isEmpty(joinItems)) return

  const m = new Map<string | number, T>();
  for (let i = 0, len = joinItems.length; i < len; i++) {
    const joinItem = joinItems[i]
    const key = joinItem[joinKeyPath]
    if (!m.get(key))
      m.set(key, joinItem)
  }

  for (let i = 0, len = items.length; i < len; i++) {
    const item = items[i]
    if (item[keyPath])
      item[propertyName] = m.get(item[keyPath]) || null
  }
  return items
}

export const ArticleNotFound = new MyHttpException({
  code: ErrorCode.NotFound.CODE,
  message: "未找到文章",
})

@Injectable()
export class ArticleService {

  @InjectRepository(Article) protected readonly repo: Repository<Article>

  all(): Promise<Article[]> {
    return this.repo.find({
      select: ["id", "image", "name", "description"],
      order: {
        created_at: "DESC",
      },

    } as any)
  }

  async userLikeArticles(
    userId: number,
    { page, pageSize = 20 }: { page: number; pageSize?: number },
  ) {
    const builder = this.repo
      .createQueryBuilder("a")
      .innerJoinAndSelect(
        "likes",
        "likes",
        "likes.like_id = a.id AND likes.user_id = :userId AND likes.type = :type",
        {
          userId,
          // type: LikeType.Article,
        },
      )
      .leftJoinAndSelect("a.user", "user")
      .leftJoinAndSelect("a.category", "category")
    return await paginate<Article>(builder, { page, pageSize })
  }

  async getHomeData() {
    const [article, banners = []] = await Promise.all([
      this.paginate({ page: 1, pageSize: 20 }, {
      }),
      this.bannerList(),
    ])
    return {
      data: article,
      banners
    }
  }

  listByUserId(userId: number, { page }: { page: number }) {
    return this.paginate(page, { userId })
  }

  async paginate(
    options: IPaginatorOptions,
    {
      s,
      userId,
      categoryId,
      tagId,
    }: {
      s?: string
      userId?: number
      categoryId?: number
      tagId?: number
    } = {},
  ) {
    const conditions = (() => {
      let conditions = [`a.public = ${true}`]
      if (categoryId) conditions.push(`a.category_id = '${categoryId}'`);
      if (s) conditions.push(`INSTR(a.title, '${s}') > 0`);
      if (userId) conditions.push(`a.user_id = ${userId}`);
      return conditions.join(' and ')
    })()

    const paginator: IPaginationOptions =
      typeof options !== "number" ? options : { page: options, pageSize: 20 }
    const [page, limit, route] = resolveOptions(paginator)
    const builder = this.repo.createQueryBuilder('a').where(conditions)
    if (tagId) builder.innerJoin('a.tags', 'tags', 'tags.id = :tagId', { tagId })

    const [items, total] = await Promise.all([
      this.getArticlesWithBuilder(builder.clone(), page, limit),
      builder.cache(3600 * 1000).getCount()
    ])

    return createPaginationObject(items, total, page, limit, route)
  }

  async getArticlesWithBuilder(builder: SelectQueryBuilder<Article>, page = 1, limit = 20) {
    const items = await builder
      .take(limit)
      .skip((page - 1) * limit)
      .getMany()

    if (!isEmpty(items)) {
      await Promise.all([
        this.loadCategory(items),
        this.loadUser(items),
      ])
    }
    return items
  }

  /**
   * 加载文章的分类
   * 
   * @param articles 
   * @returns 
   */
  private async loadCategory(articles: Article[]) {
    const categories = await this.repo
      .createQueryBuilder()
      .select()
      .relation(Article, 'category')
      .of(articles)
      .loadMany<Category>()
    return mergeItems(articles, categories, 'category_id', 'category', 'id')
  }

  /**
   * 加载文章的分类
   * 
   * @param articles 
   * @returns 
   */
  private async loadContent(items: Article[]) {
    const joinItems = await this.repo
      .createQueryBuilder()
      .select()
      .relation(Article, 'content')
      .of(items)
      .loadMany<Content>()

    return mergeItems(items, joinItems, 'id', 'content', 'article_id')
  }

  /**
   * 加载文章的作者信息
   * 
   * @param articles 
   * @returns 
   */
  private async loadUser(articles: Article[]) {
    const users = await this.repo
      .createQueryBuilder()
      .select()
      .relation(Article, 'user')
      .of(articles)
      .loadMany<User>()
    return mergeItems(articles, users, 'user_id', 'user', 'id')
  }

  async index(page: number, pageSize: number, { s }: { s?: string } = {}) {
    const builder = this.repo.createQueryBuilder("p")
    if (s) {
      builder.where("title like :title", { title: `%${s}%` })
    }

    return await paginate<Article>(builder, { page, pageSize })
  }

  bannerList() {
    return this.repo.find({
      select: ["id", "image", "slug", "title"],
      where: {
        status: ArticleStatusType.PUBLISHED,
        // image: Not(null),
      },
      take: 5,
      order: {
        published_at: "DESC",
      },
    } as any)
  }

  async findBySlug(slug: string, options: { prev?: boolean, next?: boolean } = {}) {
    const { prev = false, next = false } = options
    const article = await this.repo
      .createQueryBuilder('a')
      .where("a.slug = :slug", { slug })
      .take(1)
      .getOne()

    if (article) {
      Object.assign(article, { category: null, next: null, prev: null, user: null });
      const articles = [article]
      await Promise.allSettled([
        this.loadCategory(articles),
        this.loadUser(articles),
        this.loadContent(articles),
        ...(prev ? [this.findPrev(article, article.published_at)] : []),
        ...(next ? [this.findNext(article, article.published_at)] : []),
      ])
    }

    return article
  }

  getBuilder(name = "a") {
    return this.repo.createQueryBuilder(name)
  }

  /**
   * 获取文章
   * @param id
   * @param status
   */
  async findById(id: number | string) {
    try {
      const a = await this.repo.findOne(id, {
        select: getColumnNames(this.repo),
        relations: ["category", "user"],
      })
      return a
    } catch (error) {
      console.log(error)
    }
  }

  findPrevAndNext(id: string | number, published_at: Date): Promise<any> {
    try {
      return Promise.allSettled([
        this.findPrev(id, published_at),
        this.findNext(id, published_at),
      ])
    } catch (error) {
      return Promise.resolve([null, null])
    }
  }

  async findPrev(article: Article | number | string, published_at: Date): Promise<any> {
    const id = article instanceof Article ? article.id : article
    const conditions = { id: Not(id), public: true }
    let prev = null
    try {
      prev = await this.repo.createQueryBuilder()
        .orderBy('published_at', 'DESC')
        .where({ ...conditions, published_at: LessThan(published_at) })
        .take(1)
        .getOneOrFail();
    } catch (error) {
      // prev = null
    }
    if (article instanceof Article) {
      // merge(article, { prev })
      article.prev = prev
      // Object.assign(article, { prev });
    }
    return prev
  }

  async findNext(article: Article | number | string, published_at: Date) {
    const id = article instanceof Article ? article.id : article
    const conditions = { id: Not(id), public: true }
    let next = null
    try {
      next = await this.repo.createQueryBuilder()
        .orderBy('published_at', 'ASC')
        .where({ ...conditions, published_at: MoreThan(published_at) })
        .take(1)
        .getOneOrFail();
    } catch (error) {
      // next = null
    }
    if (article instanceof Article) {
      // merge(article, { next })
      article.next = next
      // Object.assign(article, { next });
    }
    return next
  }

  create(createArticleDto: CreateArticleDto): Promise<Article> {
    // 创建文章
    const article = {
      ...createArticleDto,
      meta: defaultMeta(),
    }
    return this.repo.save(article)
  }

  findAll() {
    return `This action returns all article`
  }

  findOne(id: number) {
    return `This action returns a #${id} article`
  }

  async update(id: number, updateArticleDto: UpdateArticleDto) {
    await this.existSlug(id, updateArticleDto.slug)
    const { ...article } = updateArticleDto
    article.id = id
    await Promise.all([this.repo.update(id, article)])
    return await this.repo.findOneOrFail(id)
  }

  remove(id: number) {
    return `This action removes a #${id} article`
  }

  async existSlug(id: number, slug: string) {
    const existedSlugId = await this.repo
      .createQueryBuilder()
      .select(["id"])
      .where({ id: Not(id), slug: slug })
      .getOne()
    if (existedSlugId) {
      throw new Error("别名已被占用")
    }
  }
}
