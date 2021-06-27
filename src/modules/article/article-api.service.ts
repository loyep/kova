import { InjectRepository } from "@nestjs/typeorm"
import { Repository, } from "typeorm"
import { Article } from "@/entity/article.entity"
import { Injectable } from "@nestjs/common"
import { MyHttpException } from "@/core/exceptions/my-http.exception"
import { ErrorCode } from "@/constants/error"

export const ArticleNotFound = new MyHttpException({
  code: ErrorCode.NotFound.CODE,
  message: "未找到文章",
})

@Injectable()
export class ArticleApiService {

  @InjectRepository(Article) protected readonly repo: Repository<Article>

  async getHomeData() {
    const article = await this.getFirstArticle()

    return {
      article,
    }
  }

  async getFirstArticle() {
    const article = await this.repo.findOne({ loadEagerRelations: false, relations: ['category'] , order: { id: 'DESC' } })
    return article
  }
}
