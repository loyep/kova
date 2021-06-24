import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"

// Controllers
import { ArticleController } from "./article.controller"

// Services
import { ArticleService } from "./article.service"

import { AipModule } from "@/modules/aip"

import { Article } from "@/entity/article.entity"

import { Topic } from "@/entity/topic.entity"

@Module({
    imports: [
        AipModule,
        TypeOrmModule.forFeature([Article, Topic]),
    ],
    controllers: [ArticleController,],
    providers: [ArticleService],
    exports: [ArticleService],
})
export class ArticleModule { }
