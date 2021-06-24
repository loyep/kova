import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { Collection } from "@/entity/collection.entity"
import { BaseService, CacheService, LoggerService } from "@kova/core"
import { Article } from "@/entity/article.entity"
import { paginate } from "@/common"

export enum CollectionType {
  Article = "article",
  Category = "category",
}

@Injectable()
export class CollectionService extends BaseService {
  constructor(
    @InjectRepository(Collection)
    private readonly repo: Repository<Collection>,
    @InjectRepository(Article)
    private readonly articleRepo: Repository<Article>,
  ) {
    super()
  }

  async isCollectiond(
    collectionId: number,
    userId: number,
    type = CollectionType.Article,
  ): Promise<boolean> {
    const count = await this.repo.count({
      where: {
        collection_id: collectionId,
        user_id: userId,
        type: type,
      },
    })
    return count > 0
  }

  async collection(
    collectionId: number,
    userId: number,
    type = CollectionType.Article,
  ): Promise<boolean> {
    try {
      if (this.isCollectiond(collectionId, userId, type)) {
        this.logger.log({
          data: {
            thecodeline: `collection warn ${type} collectionId:${collectionId} has collectiond.`,
          },
        })
        return true
      }
      await this.repo.save({
        collection_id: collectionId,
        user_id: userId,
        type: type,
      })
    } catch (error) {
      //
    }
    return true
  }

  async cancelCollection(
    collectionId: number,
    userId: number,
    type = CollectionType.Article,
  ): Promise<boolean> {
    try {
      await this.repo.delete({
        collection_id: collectionId,
        user_id: userId,
        type: type,
      })
      return true
    } catch (error) {
      return false
    }
  }

  async userCollectionArticles(
    userId: number,
    { page, pageSize = 20 }: { page: number; pageSize?: number },
  ) {
    const builder = this.articleRepo
      .createQueryBuilder("a")
      .innerJoinAndSelect(
        "collections",
        "collections",
        "collections.collection_id = a.id AND collections.user_id = :userId AND collections.type = :type",
        {
          userId,
          type: CollectionType.Article,
        },
      )
      .leftJoinAndSelect("a.user", "user")
      .leftJoinAndSelect("a.category", "category")
    return await paginate<Article>(builder, { page, pageSize })
  }
}
