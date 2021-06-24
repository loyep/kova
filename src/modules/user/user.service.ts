import { CacheService } from '@/core/cache'
import { LoggerService } from '@/core/logger'
import { User, UserStatus } from "@/entity/user.entity"
import { Inject, Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Like, Repository } from "typeorm"
import { compareSync, hashSync } from "bcrypt"
import { ListResult } from "@/entity/_base.entity"
import { paginate } from "@/core/common/paginate"
import { CreateUserDto } from "./dto/create-user.dto"
import { UpdateUserDto } from "./dto/update-user.dto"
import { FindConditions } from "typeorm/find-options/FindConditions"
// import { FindOptionsOrder, FindOptionsSelect } from "typeorm/find-options/FindOptions"

// type OrderType = FindOptionsOrder<User>

// type WhereType = FindOptionsWhere<User>

@Injectable()
export class UserService {
  @Inject(CacheService) private readonly cache: CacheService
  @Inject(LoggerService) private readonly logger: LoggerService

  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) {
  }

  async list({
    page,
    pageSize = 20,
  }: {
    page: number
    pageSize?: number
  }): Promise<ListResult<User>> {
    const [list, count] = await this.repo.findAndCount({
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

  paginate(
    page: number,
    { s, status = UserStatus.active }: { s?: string; status?: UserStatus } = {},
  ) {
    return paginate<User>(
      this.repo,
      { page, pageSize: 20 },
      {
        where: {
          status,
          ...(s ? { name: Like(`%${s}%`) } : {}),
        },
      },
    )
  }

  async index(
    page: number,
    pageSize: number,
    { s, where = {} }: { s?: string; where?: FindConditions<User> } = {},
    select?: (keyof User)[],
  ) {
    return await paginate<User>(
      this.repo,
      { page, pageSize },
      {
        select,
        where: {
          ...(where || ({} as any)),
          ...(s ? { name: Like(`%${s}%`) } : {}),
        },
        order: {
          id: "DESC",
        },
      },
    )
  }

  async all(): Promise<User[]> {
    const users: User[] = await this.repo.find({
      order: {
        created_at: "DESC",
      },
    })
    console.log(users)
    return users
  }

  verifyPassword(password: string, oldPwd: string) {
    console.log(password, oldPwd)
    if (!password || !oldPwd) {
      return false
    }
    console.log(password)
    try {
      const hashPwd = hashSync(password, 10)
      console.log(hashPwd)
    } catch (error) {
      console.log(error)
    }
    return compareSync(password, oldPwd)
  }

  async getUser(id: number): Promise<User> {
    const user = await this.repo.findOne({
      select: ["id", "status", "name", "avatar", "login", "email"],
      where: { id: id },
    })

    console.log(user)
    return user
  }

  async findUser(where: FindConditions<User>, select: (keyof User)[] = []) {
    const user = await this.repo.findOne({
      select,
      where,
    })
    console.log(user)
    return user
  }

  async findByName(login: string, status: UserStatus | null = UserStatus.active) {
    const user = await this.repo.findOneOrFail({
      where: {
        login,
        ...(status ? { status } : {}),
      },
      // relations: ['category', 'user', 'content'],
    })

    user.url = user.url || ""
    return user
  }

  findById(id: number | string) {
    return this.repo.findOneOrFail(id)
  }

  create(createUserDto: CreateUserDto) {
    console.log(createUserDto)
    return "This action adds a new user"
  }

  findAll() {
    return `This action returns all users`
  }

  findOne(id: number) {
    return `This action returns a #${id} user`
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const existedLogin = await this.repo
      .createQueryBuilder()
      .where("id != :id", { id: id })
      .andWhere("(login = :login or email = :email)", {
        login: updateUserDto.login,
        email: updateUserDto.email,
      })
      .getCount()

    this.logger.log(existedLogin)
    if (existedLogin > 0) {
      throw new Error("别名已被占用")
    }
    await this.repo.update(id, updateUserDto)
    return await this.repo.findOneOrFail(id)
  }

  remove(id: number) {
    return `This action removes a #${id} user`
  }
}
