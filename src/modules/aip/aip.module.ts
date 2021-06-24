import { DynamicModule, HttpModule, Module } from "@nestjs/common"
import { AipService } from "./aip.service"
import { TranslateService } from "./translate.service"
import { SolutionService } from "@/modules/aip/solution.service"

@Module({
  imports: [HttpModule.register({ timeout: 5000 })],
  controllers: [],
  providers: [AipService, TranslateService, SolutionService],
  exports: [AipService, TranslateService, SolutionService],
})
export class AipModule {

  static forRoot(): DynamicModule {
    return {
      module: AipModule,
      imports: [HttpModule.register({ timeout: 5000 })],
      controllers: [],
      providers: [AipService, TranslateService, SolutionService],
      exports: [AipService, TranslateService, SolutionService],
    }
  }
}
