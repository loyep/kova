import { NestFactory } from '@nestjs/core'
import { ExpressAdapter, NestExpressApplication } from '@nestjs/platform-express'
import { initialSSRDevProxy, loadConfig } from 'ssr-server-utils'
import { AppModule } from './app.module'
import { bootstrapExpress } from './bootstrap'

async function bootstrap(): Promise<void> {
  const express = new ExpressAdapter()
  const app = await NestFactory.create<NestExpressApplication>(AppModule, express)
  await initialSSRDevProxy(app, {
    express: true
  })
  await bootstrapExpress(app)
  const { serverPort } = loadConfig()
  await app.listen(serverPort)
}

bootstrap().then(app => {
  console.log('Nest application successfully started')
}).catch(err => {
  console.log(err)
  process.exit(1)
})
