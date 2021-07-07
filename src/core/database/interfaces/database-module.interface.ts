import { EntitySchema } from "typeorm";

export type DatabaseModuleOptions = {
    entities?: ((Function | string | EntitySchema<any>))[];
}