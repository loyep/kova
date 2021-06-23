import { Global, Module } from "@nestjs/common"
import { ConfigModule as NestConfigModule } from '@nestjs/config'
import * as yaml from 'js-yaml'
import { resolve } from 'path'
import * as fs from 'fs'
import { merge } from "lodash"

const resolveFile = (file: string) => {
  return resolve(process.cwd(), file)
}

const loadYamlFile = () => ([
  resolveFile('kova.yml'),
  resolveFile(`kova.${process.env.NODE_ENV}.yml`),
]).reduce((config: any, filepath: string) => {
  if (fs.existsSync(filepath)) {
    const c = yaml.load(fs.readFileSync(filepath, 'utf8'))
    merge(config, c)
  }
  return config
}, {})

const imports = [
  NestConfigModule.forRoot({
    isGlobal: true,
    cache: true,
    load: [loadYamlFile]
  })
]

@Global()
@Module({
  imports,
})
export class ConfigModule {
}
