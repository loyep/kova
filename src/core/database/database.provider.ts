
import { TypeOrmModule } from "@nestjs/typeorm"
import { TypeOrmLogger } from "../logger/typeorm.logger"
import { CustomNamingStrategy } from "./naming.strategy"
import { DatabaseModuleOptions } from "./interfaces/database-module.interface"
import { join } from "path"
import { Logger } from "typeorm/logger/Logger"
import { Config2Service } from "../config.service"

export function createAsyncTypeOrm({ entities = [] }: Partial<DatabaseModuleOptions> = {}) {
    const mysqlConf = Config2Service.get('mysql')
    const entityPath = join(__dirname, "../../entity/**/*.entity{.ts,.js}")
    const cache = Config2Service.get('redis.default') || {}
    return TypeOrmModule.forRoot({
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
    })
}