import { NestFactory } from '@nestjs/core';
import { MainModule } from './main.module';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

async function bootstrap() {
  const app = await NestFactory.create(MainModule);

  const corsOptions: CorsOptions = {
    origin: '*',
    methods: '*',
    allowedHeaders: '*',
  };

  app.enableCors(corsOptions);
  app.useWebSocketAdapter(new IoAdapter(app));

  await app.listen(8080);
}
bootstrap();
