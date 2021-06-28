import { User } from "~/entity/user.entity"
import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"

@Injectable()
export class FollowService {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) {
  }

  // 获取当前用户的关注者列表
  getFollowers(userId: number | string) {
    const builder = this.followers(userId)
    return builder.getMany()
  }

  // 获取当前用户的关注者列表
  getFollowersCount(userId: number | string) {
    const builder = this.followers(userId)
    return builder.getCount()
  }

  // 获取当前用户的关注者列表
  getFollowersAndCount(userId: number | string) {
    const builder = this.followers(userId)
    return builder.getManyAndCount()
  }

  followers(userId: number | string) {
    const builder = this.repo
      .createQueryBuilder("u")
      .leftJoin("u.followers", "f", "follower_id = :userId", { userId })
    return builder
  }

  followings(userId: number | string) {
    const builder = this.repo
      .createQueryBuilder("u")
      .innerJoin("u.followings", "f", "user_id = :userId", { userId })
    return builder
  }

  // 获取当前用户在关注列表
  getFollowings(userId: number | string) {
    const builder = this.followings(userId)
    return builder.getManyAndCount()
  }

  // 获取当前用户在关注列表
  getFollowingsCount(userId: number | string) {
    const builder = this.followings(userId)
    return builder.getCount()
  }

  // 获取当前用户在关注列表
  getFollowingsAndCount(userId: number | string) {
    const builder = this.followings(userId)
    return builder.getManyAndCount()
  }
}
