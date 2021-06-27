import { Global, Module } from "@nestjs/common"
import { ConfigModule as NestConfigModule } from '@nestjs/config'
import * as yaml from 'js-yaml'
import { resolve } from 'path'
import * as fs from 'fs'
import { merge } from "lodash"

const resolveFile = (file: string) => resolve(process.cwd(), file)

const loadYamlFile = () => {
  const config = [
    resolveFile('kova.default.yml'),
    resolveFile(`kova.${process.env.NODE_ENV || 'development'}.yml`),
  ].reduce((config: any, filepath: string) => {
    if (fs.existsSync(filepath)) {
      const c = yaml.load(fs.readFileSync(filepath, 'utf8'))
      merge(config, c)
    }
    return config
  }, {})
  console.log(config)
  return config
}

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
