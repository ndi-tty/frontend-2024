import { Module } from '@nestjs/common';
import { AppController } from './http/app.controller';
import { AppService } from './http/app.service';
import { WebsocketModule } from './websocket/websocket.module';
import { LoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    WebsocketModule,
    LoggerModule.forRoot({
      pinoHttp: {
        autoLogging: {
          ignore: (req: any) => {
            return req.originalUrl?.startsWith('/health');
          },
        },
        transport:
          process.env.NODE_ENV !== 'production'
            ? { target: 'pino-pretty' }
            : undefined,
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class MainModule {}
