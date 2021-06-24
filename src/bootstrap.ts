import { NestExpressApplication } from "@nestjs/platform-express";
import { join } from 'path'
import { getCwd } from 'ssr-server-utils'

export async function bootstrapExpress(app: NestExpressApplication, listening = true) {
  app.useStaticAssets(join(getCwd(), './build'), {
    setHeaders: (res: any, path: string, stat: any) => {
      console.log('res', res)
    }
  })
  app.set('x-powered-by', false)

  return app
}
