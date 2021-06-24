import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"

// Controllers
import { ArticleApiController } from "./article-api.controller"
import { ArticleController } from "./article.controller"

// Services
import { ArticleService } from "./article.service"
import { ArticleApiService } from "./article-api.service"

import { AipModule } from "@/modules/aip"

import { Article } from "@/entity/article.entity"

@Module({
    imports: [
        AipModule,
        TypeOrmModule.forFeature([Article]),
    ],
    controllers: [ArticleController, ArticleApiController],
    providers: [ArticleService, ArticleApiService],
    exports: [ArticleService],
})
export class ArticleModule { }
