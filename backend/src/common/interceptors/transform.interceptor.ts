import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  success: boolean;
  data: T;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    const httpContext = context.switchToHttp();
    const response = httpContext.getResponse();

    // Skip wrapping if headers have been sent or it's a file download/stream
    if (response.headersSent || response.getHeader('Content-Type')?.includes('image/') || response.getHeader('Content-Type')?.includes('application/pdf')) {
      return next.handle();
    }

    return next.handle().pipe(
      map(data => {
        // If data is already wrapped or has its own format, return it
        if (data && typeof data === 'object' && 'success' in data) {
          return data;
        }
        return {
          success: true,
          data: data === undefined ? null : data,
        };
      }),
    );
  }
}
