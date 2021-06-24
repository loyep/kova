import { SsrRender } from '@/core/render'
import { Controller, Get, } from '@nestjs/common'
import { ArticleService } from './article.service'

@Controller()
export class ArticleController {
  constructor(private readonly service: ArticleService) { }

  @Get('/')
  @SsrRender()
  test() {
    // console.log('this.cache22', this.cache2)
    // console.log('this.cache', this.cache)
    return { service: this.service }
    // setTimeout(() => {
    //     console.log('\n\n\n\n\n\n\n')
    //     let date = new Date()
    //     const arr = []
    //     for (let index = 0; index < 100000; index++) {
    //         arr.push({
    //             high: 333.22,
    //             low: 320.333333,
    //             close: "340"
    //         })
    //     }
    //     console.log(`${Date.now() - date.getTime()}毫秒`)
    //     date = new Date()
    //     const str = JSON.stringify(arr)
    //     console.log(`${Date.now() - date.getTime()}毫秒`)
    //     date = new Date()
    //     const newArr = JSON.parse(str)
    //     console.log(`${Date.now() - date.getTime()}毫秒`)
    //     date = new Date()
    //     const data = plainToClass(StockModel, newArr)
    //     console.log(`${Date.now() - date.getTime()}毫秒`)
    //     console.log(data[0])
    //     console.log('\n\n\n\n\n\n\n')
    // }, 0)

    // console.log("script start");
    // setTimeout(function () {
    //     console.log("setTimeout");
    // }, 0)
    // Promise.resolve().then(function () {
    //     console.log("promise1");
    // }).then(function () {
    //     console.log("promise2");
    // })
    // console.log('script end');
  }

}
