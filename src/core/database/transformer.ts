import { ValueTransformer } from 'typeorm';
import dayjs from 'dayjs'
import { merge } from 'lodash'

export class LocalDateTransformer implements ValueTransformer {
    // To db from typeorm
    public to(value: Date): Date {
        return value;
    }
    // From db to typeorm
    public from(value: any): Date {
        return dayjs.isDayjs(dayjs(value))
            ? dayjs(value).format('YYYY-MM-DD HH:mm:ss')
            : value;
    }
}

export class MetaTransformer implements ValueTransformer {

    protected defaultMeta = {}

    constructor(defaultMeta: any) {
        this.defaultMeta = defaultMeta || {}
    }

    // To db from typeorm
    public to(value: any): any {
        return value;
    }
    // From db to typeorm
    public from(value: any): any {
        return (value instanceof Object && this.defaultMeta)
            ? merge(this.defaultMeta, value)
            : value
    }
}