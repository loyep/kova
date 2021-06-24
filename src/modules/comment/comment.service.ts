import { Injectable, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { Comment } from "@/entity/comment.entity"
import { ListResult } from "@/entity/_base.entity"
import { paginate } from "@/common"
import { CreateCommentDto } from "@/modules/comment/dto/create-comment.dto"
import { UpdateCommentDto } from "@/modules/comment/dto/update-comment.dto"

export const CommentNotFound = new NotFoundException("未找到分类")

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly repo: Repository<Comment>,
  ) {}

  all(): Promise<Comment[]> {
    return this.repo.find({
      select: ["id", "image", "name", "description"],
      order: {
        created_at: "DESC",
      },
    } as any)
  }

  async paginate(page: number, { s }: { s?: string } = {}) {
    return await paginate<Comment>(this.repo, { page, pageSize: 20 })
  }

  async index(
    page: number,
    pageSize: number,
    { s }: { s?: string } = {},
    select?: (keyof Comment)[],
  ) {
    console.log(s)
    return await paginate<Comment>(
      this.repo,
      { page, pageSize },
      {
        select,
      },
    )
  }

  async list({
    page,
    pageSize = 20,
  }: {
    page: number
    pageSize?: number
  }): Promise<ListResult<Comment>> {
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

  // findBySlug(slug: string) {
  //   return this.repo.findOneOrFail(
  //     {
  //       slug: slug,
  //     } as FindOptionsWhere<>,
  //     {
  //       select: ["id"],
  //     },
  //   )
  // }

  findById(id: number | string) {
    return this.repo.findOne(id, {
      select: ["id"],
      relations: [],
    })
  }

  async create(createCommentDto: CreateCommentDto, { ip }: { ip: string }) {
    const comment = new Comment()
    comment.user_id = 1
    comment.content = createCommentDto.content
    comment.article_id = createCommentDto.article_id
    comment.url = createCommentDto.url
    comment.email = createCommentDto.email
    comment.ip = ip
    return await this.repo.save(comment)
  }

  findAll() {
    return `This action returns all comment`
  }

  findOne(id: number) {
    return `This action returns a #${id} comment`
  }

  update(id: number, updateCommentDto: UpdateCommentDto) {
    return `This action updates a #${id} comment`
  }

  remove(id: number) {
    return `This action removes a #${id} comment`
  }
}
