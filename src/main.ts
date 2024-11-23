import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as yaml from 'js-yaml';
import 'dotenv/config';
import { readFileSync } from 'node:fs';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

const PORT = process.env.PORT || 4000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // const swaggerDoc = yaml.load(
  //   readFileSync('doc/api.yaml', { encoding: 'utf-8' }),
  // ) as OpenAPIObject;

  // SwaggerModule.setup('doc', app, swaggerDoc);
  // app.useGlobalPipes(new ValidationPipe());
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
