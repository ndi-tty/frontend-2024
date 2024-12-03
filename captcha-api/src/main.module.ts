import { Module } from '@nestjs/common';
import { AppController } from './http/app.controller';
import { AppService } from './http/app.service';
import { WebsocketModule } from './websocket/websocket.module';

@Module({
  imports: [WebsocketModule],
  controllers: [AppController],
  providers: [AppService],
})
export class MainModule {}
