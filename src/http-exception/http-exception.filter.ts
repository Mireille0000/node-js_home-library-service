import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { PrismaClientValidationError } from '@prisma/client/runtime/library';
import { Response, Request } from 'express';
import { CustomLoggerService } from 'src/logger/custom-logger.service';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new CustomLoggerService(HttpExceptionFilter.name)
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    ) {}
  
  catch(exception: unknown, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();
    // const status = exception.getStatus();

    const responseObj = {
      statusCode: response.statusCode,
      timastamp: new Date().toISOString(),
      path: request.url,
      response: ''
    }

    if(exception instanceof HttpException) {
      responseObj.statusCode = exception.getStatus();
      responseObj.response = exception.getResponse() as string;
    } else if(exception instanceof PrismaClientValidationError) {
      responseObj.statusCode = 422;
      responseObj.response = exception.message;
    } else {
      responseObj.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      responseObj.response = 'Internal Server Error';
    }

    const errorResponse = JSON.stringify(responseObj.response);

    this.logger.error(`Exception: ${errorResponse}`, exception instanceof Error ? exception.stack : '')
    response.status(responseObj.statusCode).json(responseObj);
  }
}
