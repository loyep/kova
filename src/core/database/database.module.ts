import { DynamicModule, Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { ConfigService } from "@nestjs/config"
import { TypeOrmLogger } from "../logger/typeorm.logger"
import { CustomNamingStrategy } from "./naming.strategy"
import { DatabaseModuleOptions } from "./interfaces/database-module.interface"
import * as path from "path"
import { Logger } from "typeorm/logger/Logger"

@Module({
  imports: [
  ]
})
export class DatabaseModule {
  
  private static createAsyncTypeOrm({ entities = [] }: Partial<DatabaseModuleOptions>) {
    return TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const entityPath = path.join(__dirname ,"../../entity/**/*.entity{.ts,.js}")

        const cache = configService.get('redis.default') || {}
        const mysqlConf = configService.get('mysql2') || {}

        return {
          type: 'mysql',
          url: mysqlConf.url,
          host: mysqlConf.host || '127.0.0.1',
          port: mysqlConf.port || 3306,
          charset: 'UTF8MB4_UNICODE_CI',
          database: mysqlConf.database,
          username: mysqlConf.username,
          password: mysqlConf.password,
          synchronize: false,
          entities: [...entities, entityPath].filter(e => e),
          autoLoadEntities: true,
          logging: "all", // query, error, schema, warn, info, log, all
          logger: new TypeOrmLogger() as Logger,
          maxQueryExecutionTime: 20, // 单位毫秒
          namingStrategy: new CustomNamingStrategy(),
          cache: {
            type: 'ioredis',
            options: {
              host: cache.host,
              port: cache.port,
              password: cache.password,
              db: cache.database,
            }
          },
          extra: {
            supportBigNumbers: true,
            bigNumberStrings: true,
            multipleStatements: true
          },
        }
      },
      inject: [ConfigService],
    })
  }

  static forRoot(options: DatabaseModuleOptions = {}): DynamicModule {
    return {
      global: true,
      module: DatabaseModule,
      imports: [
        this.createAsyncTypeOrm(options),
        // this.createAsyncTypeGoose()
      ]
    };
  }
}