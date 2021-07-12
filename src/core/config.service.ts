import { Injectable } from '@nestjs/common';
import { get } from 'lodash';

import yaml from 'js-yaml'
import { resolve } from 'path'
import * as fs from 'fs'
import { merge } from "lodash"

const resolveFile = (file: string) => resolve(process.cwd(), file)

const loadYamlFile = (): Record<string, any> =>
    [
        resolveFile('kova.default.yml'),
        resolveFile(`kova.${process.env.NODE_ENV || 'development'}.yml`)
    ]
        .reduce((config: any, filepath: string) => {
            if (fs.existsSync(filepath)) {
                const c = yaml.load(fs.readFileSync(filepath, 'utf8'))
                merge(config, c)
            }
            return config
        }, {})

const _config: Record<string, any> = loadYamlFile()

@Injectable()
export class Config2Service {

    private static get config() {
        return _config
    }

    constructor() {
    }

    get localConfig() {
        return _config
    }

    get(path: string) {
        return get(this.localConfig, path)
    }

    public static get(path: string) {
        return get(this.config, path)
    }

}
