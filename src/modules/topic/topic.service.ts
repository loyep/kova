import { Injectable, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Like, Repository } from "typeorm"
import { Topic } from "@/entity/topic.entity"
import { ListResult } from "@/entity/_base.entity"
import { paginate } from "@/core/common/paginate"

export const TopicNotFound = new NotFoundException("未找到专题")

@Injectable()
export class TopicService {
  constructor(
    @InjectRepository(Topic)
    private readonly repo: Repository<Topic>,
  ) {}

  all(): Promise<Topic[]> {
    return this.repo.find({
      select: ["id", "image", "name", "description", "posts_count"],
      order: {
        created_at: "DESC",
      },
    } as any)
  }

  async paginate(page: number, { s }: { s?: string } = {}) {
    return await paginate<Topic>(
      this.repo,
      { page, pageSize: 20 },
      {
        where: {
          ...(s ? { name: Like(`%${s}%`) } : {}),
        },
      },
    )
  }

  async index(
    page: number,
    pageSize: number,
    { s }: { s?: string } = {},
    select?: (keyof Topic)[],
  ) {
    return await paginate<Topic>(
      this.repo,
      { page, pageSize },
      {
        select,
        where: {
          ...(s ? { name: Like(`%${s}%`) } : {}),
        },
      },
    )
  }

  async list({
    page,
    pageSize = 20,
  }: {
    page: number
    pageSize?: number
  }): Promise<ListResult<Topic>> {
    const [list, count] = await this.repo.findAndCount({
      where: {},
      skip: (page - 1) * pageSize,
      take: pageSize,
    })
    return {
      list,
      meta: {
        count,
        page,
        pageSize,
        totalPage: Math.ceil(count / pageSize),
      },
    }
  }

  findBySlug(slug: string) {
    return this.repo.findOneOrFail({
      select: ["id", "image", "name", "description", "articles_count", "slug"],
      where: {
        slug,
      },
      relations: [],
    })
  }

  findById(id: number | string) {
    return this.repo.findOne(id, {
      select: ["id", "image", "name", "description", "articles_count", "slug"],
      relations: [],
    })
  }

  async update(tagId: number | string, newTopic: Topic) {
    const existedSlug = await this.repo
      .createQueryBuilder()
      .where("id != :id", { id: tagId })
      .andWhere("slug = :slug", { slug: newTopic.slug })
      .getCount()

    if (existedSlug > 0) {
      throw new Error("别名已被占用")
    }
    await this.repo.update(tagId, newTopic)
    return await this.repo.findOneOrFail(tagId)
  }
}
