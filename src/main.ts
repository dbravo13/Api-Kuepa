import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.enableCors({
    origin: ['http://localhost:3000', 'https://client-kuepa-sx2b.vercel.app'],
  });

  const port = process.env.PORT || 3009;
  await app.listen(port);
  console.log(`La aplicación se está ejecutando en: http://localhost:${port}`);
}
void bootstrap();
