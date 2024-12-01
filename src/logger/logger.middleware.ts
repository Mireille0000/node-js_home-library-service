import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { CustomLoggerService } from './custom-logger.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new CustomLoggerService();
  use(request: Request, response: Response, next: () => void) {
    const {ip, method, query, originalUrl, body} = request

    const userAgent = request.get("user-agent") || "";

    response.on("finish", () => {
      const { statusCode } = response;
      const contentLength = response.get("content-length");

      const queryParam = JSON.stringify(query);
      const bodyParam = JSON.stringify(body);

      this.logger.log(
        `${method} ${originalUrl} ${queryParam} ${bodyParam} ${statusCode} ${contentLength} - ${userAgent} ${ip}`,
      );
    });
    next();
  }
}
