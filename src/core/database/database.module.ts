import { DynamicModule, Global, Module } from "@nestjs/common"
import { DatabaseModuleOptions } from "./interfaces/database-module.interface"
import { createAsyncTypeOrm } from './database.provider'

@Global()
@Module({
  imports: [
    createAsyncTypeOrm()
  ]
})
export class DatabaseModule {


  static forRoot(options: DatabaseModuleOptions = {}): DynamicModule {
    return {
      global: true,
      module: DatabaseModule,
      imports: [
        createAsyncTypeOrm(options),
      ]
    };
  }
}