import { Injectable, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Like, Repository } from "typeorm"
import { Tag } from "@/entity/tag.entity"
import { ListResult } from "@/entity/_base.entity"
import { paginate } from "@/core/common/paginate"
import { CreateTagDto } from "@/modules/tag/dto/create-tag.dto"
import { UpdateTagDto } from "@/modules/tag/dto/update-tag.dto"

export const TagNotFound = new NotFoundException("未找到标签")

@Injectable()
export class TagService {
  static readonly select: (keyof Tag)[] = [
    "id",
    "image",
    "name",
    "description",
    "articles_count",
    "slug",
  ]

  constructor(
    @InjectRepository(Tag)
    private readonly repo: Repository<Tag>,
  ) {}

  async all(): Promise<Tag[]> {
    const tags: Tag[] = await this.repo.find({
      select: ["id", "image", "name", "description", "articles_count"],
      order: {
        created_at: "DESC",
      },
    })
    console.log(tags)
    return tags
  }

  async paginate(page: number, { s }: { s?: string } = {}) {
    return await paginate<Tag>(
      this.repo,
      { page, pageSize: 20 },
      {
        where: {
          ...(s ? { name: Like(`%${s}%`) } : {}),
        },
      },
    )
  }

  async index(page: number, pageSize: number, { s }: { s?: string } = {}, select?: (keyof Tag)[]) {
    return await paginate<Tag>(
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
  }): Promise<ListResult<Tag>> {
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

  async findBySlug(slug: string, select: (keyof Tag)[] = TagService.select) {
    return await this.repo.findOneOrFail({
      select,
      where: {
        slug,
      },
      relations: [],
    })
  }

  async findById(id: number | string, select: (keyof Tag)[] = TagService.select) {
    const tag = await this.repo.findOne(id, {
      select,
    })
    console.log(tag)
    return tag
  }

  create(createTagDto: CreateTagDto) {
    console.log(createTagDto)
    return "This action adds a new tag"
  }

  findAll() {
    return `This action returns all tag`
  }

  findOne(id: number) {
    return `This action returns a #${id} tag`
  }

  async update(tagId: number | string, updateTagDto: UpdateTagDto) {
    await this.existSlug(tagId, updateTagDto.slug)
    await this.repo.update(tagId, updateTagDto)
    return await this.repo.findOneOrFail(tagId)
  }

  remove(id: number) {
    return `This action removes a #${id} tag`
  }

  async existSlug(id: number | string, slug: string) {
    const existedTag = await this.repo
      .createQueryBuilder()
      .where("id != :id", { id })
      .andWhere("slug = :slug", { slug })
      .getOne()
    if (existedTag) {
      throw new Error("别名已被占用")
    }
  }
}
