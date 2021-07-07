import { Module } from '@nestjs/common'

// Controllers
import { CollectionController } from './collection.controller'

// Entities

// Services
import { CollectionService } from './collection.service'

@Module({
  imports: [],
  controllers: [CollectionController],
  providers: [CollectionService],
  exports: [CollectionService]
})
export class CollectionModule {}
