import { Module } from '@nestjs/common';
import { FlappyBirdGateway } from './gateway/flappy-bird.gateway';
import { FlappyBirdService } from './services/flappy-bird.service';
import { WhereIsCharlieGateway } from './gateway/where-is-charlie.gateway';
import { WhereIsCharlieService } from './services/where-is-charlie.service';
import { WsFingerPrintGuard } from './guards/ws-fingerprint.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CaptchaFingerPrint } from './guards/entities/fingerprint.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: 5432,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_DATABASE,
      entities: [CaptchaFingerPrint],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([CaptchaFingerPrint]),
  ],
  providers: [
    FlappyBirdGateway,
    FlappyBirdService,
    WsFingerPrintGuard,
    WhereIsCharlieGateway,
    WhereIsCharlieService,
  ],
})
export class WebsocketModule {}
