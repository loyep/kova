import { EntitySchema } from "typeorm";

export type DatabaseModuleOptions = {
    entities?: ((Function | string | EntitySchema<any>))[];
}

export type MongoDbConnectionOptions = {
    host: string
    port?: string | number
    database: string
    password?: string
    username?: string
}