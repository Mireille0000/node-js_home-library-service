import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { CustomLoggerService } from 'src/logger/custom-logger.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private logger = new CustomLoggerService();
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request =  context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse()
    const controller = context.getClass().name;
    const {ip, method, query, originalUrl, body} = request;
    const { statusCode } = response;
    const userAgent = request.get("user-agent") || "";

    return next.handle().pipe(
      tap(() => {
        const contentLength = response.get("content-length");

        const queryParam = JSON.stringify(query);
        const bodyParam = JSON.stringify(body);

        this.logger.log(
          `${method} ${originalUrl} ${queryParam} ${bodyParam} ${statusCode} - ${userAgent} ${ip}`,
          controller
        );
      })
    );
  }
}
