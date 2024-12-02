import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
dotenv.config();
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { CustomLoggerService } from './logger/custom-logger.service';
import { LoggingInterceptor } from './logging-interceptor/logging.interceptor';

const PORT = process.env.PORT || 4000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  const logger = app.get(CustomLoggerService);
  app.useLogger(logger);
  app.useGlobalInterceptors(new LoggingInterceptor(logger));
  
  app.useGlobalPipes(new ValidationPipe()); //
  const config = new DocumentBuilder()
    .setTitle('Home Library API')
    .setDescription('The Home Library API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('doc', app, document);

  await app.listen(PORT);
  console.log(
    `Swagger ${process.pid} works on the http://localhost:${PORT}/doc`,
  );
}

bootstrap();
