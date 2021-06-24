
import { applyDecorators, SetMetadata, UseInterceptors } from '@nestjs/common';
import { SSR_RENDER_METADATA } from './ssr-render.constants';
import { SsrRenderInterceptor as BaseSsrRenderInterceptor, SsrRenderOptions } from './ssr-render.interceptor';

export function SsrRender(options: SsrRenderOptions = {}): MethodDecorator {
  return applyDecorators(
    SetMetadata(SSR_RENDER_METADATA, options),
    // Injectable({ scope: Scope.REQUEST }),
    UseInterceptors(BaseSsrRenderInterceptor)
  )
}