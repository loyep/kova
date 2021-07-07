import { Module } from '@nestjs/common'

// Controllers
import { CategoryController } from './category.controller'

// Services
import { CategoryService } from './category.service'
import { Category } from '~/entity/category.entity'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [CategoryService]
})
export class CategoryModule {
}
