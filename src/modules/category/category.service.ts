import { Injectable, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Like, Not, Repository } from "typeorm"
import { Category } from "~/entity/category.entity"
import { ListResult } from "~/entity/_base.entity"
import { paginate } from "~/core/common/paginate"
import { CreateCategoryDto } from "~/modules/category/dto/create-category.dto"
import { UpdateCategoryDto } from "~/modules/category/dto/update-category.dto"

export const CategoryNotFound = new NotFoundException("未找到分类")

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly repo: Repository<Category>,
  ) {}

  all(): Promise<Category[]> {
    return this.repo.find({
      select: ["id", "image", "name", "description", "posts_count"],
      order: {
        created_at: "DESC",
      },
    } as any)
  }

  async paginate(page: number, { s }: { s?: string } = {}) {
    return await paginate<Category>(
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
    select?: (keyof Category)[],
  ) {
    return await paginate<Category>(
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
  }): Promise<ListResult<Category>> {
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

  findById(id: number) {
    return this.repo.findOne(id, {
      select: ["id", "image", "name", "description", "articles_count", "slug"],
    })
  }

  create(createCategoryDto: CreateCategoryDto) {
    console.log(createCategoryDto)
    return "This action adds a new category"
  }

  findAll() {
    return `This action returns all category`
  }

  findOne(id: number) {
    return this.repo.findOne(id, {
      select: ["id", "image", "name", "description", "articles_count", "slug"],
    })
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const existedSlug = await this.existSlug(id, updateCategoryDto.slug)
    if (existedSlug) {
      throw new Error("别名已被占用")
    }
    await this.repo.update(id, updateCategoryDto)
    return await this.repo.findOneOrFail(id)
  }

  remove(id: number) {
    return `This action removes a #${id} category`
  }

  async existSlug(id: number | string, slug: string) {
    const existedTag = await this.repo
      .createQueryBuilder()
      .where({ id: Not(id), slug })
      .getOne()
    return !!existedTag
  }
}
