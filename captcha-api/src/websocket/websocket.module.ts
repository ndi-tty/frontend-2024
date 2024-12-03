import { Module } from '@nestjs/common';
import { WebsocketGateway } from './gateway/websocket.gateway';
import { CaptchaService } from './services/captcha.service';

@Module({
  providers: [WebsocketGateway, CaptchaService],
})
export class WebsocketModule {}
