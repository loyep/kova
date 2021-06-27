import type { NestExpressApplication } from "@nestjs/platform-express";
import type { NestFastifyApplication } from "@nestjs/platform-fastify";
import { join } from 'path'
import { getCwd } from 'ssr-server-utils'

export async function bootstrapExpress(app: NestExpressApplication, listening = true) {
  app.useStaticAssets(join(getCwd(), './build'))
  app.set('x-powered-by', false)

  return app
}

export async function bootstrapFastify(app: NestFastifyApplication, listening = true) {
  // app.useStaticAssets(join(getCwd(), './build'))
  // app.set('x-powered-by', false)

  return app
}
