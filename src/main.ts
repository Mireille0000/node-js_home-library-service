import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as yaml from "js-yaml";
import 'dotenv/config';
import { readFileSync } from 'node:fs';
import { OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

const PORT = process.env.PORT;


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const swaggerDoc = yaml.load(
    readFileSync('doc/api.yaml', { encoding: 'utf-8' }),
  ) as OpenAPIObject;

  SwaggerModule.setup('doc', app, swaggerDoc);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(PORT);
  console.log(
    `Swagger ${process.pid} works on the http://localhost:${PORT}/doc`,
  );
}

bootstrap();