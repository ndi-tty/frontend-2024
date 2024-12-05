import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import {
  Coordonate,
  InitGamePayload,
  ResultPayload,
  StartGamePayload,
  WhereIsCharlieService,
} from '../services/where-is-charlie.service';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

export enum Events {
  INIT_GAME = 'init-game',
  START_GAME = 'start-game',
  ERROR = 'error',
  SUBMIT_COORDONATES = 'submit-coordonates',
}

@WebSocketGateway({ cors: true, namespace: 'where-is-charlie' })
export class WhereIsCharlieGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly whereIsCharleyService: WhereIsCharlieService,
    @InjectPinoLogger(WhereIsCharlieGateway.name)
    private readonly logger: PinoLogger,
  ) {}

  handleConnection() {
    this.logger.info('client connected');
  }

  @SubscribeMessage(Events.INIT_GAME)
  handleInitGame(): InitGamePayload {
    return this.whereIsCharleyService.handleInitGame();
  }

  @SubscribeMessage(Events.START_GAME)
  handleStartGame(@ConnectedSocket() client: Socket): StartGamePayload {
    return this.whereIsCharleyService.handleStartGame();
  }

  @SubscribeMessage(Events.SUBMIT_COORDONATES)
  handleCoordonates(
    @MessageBody() data: Coordonate,
    @ConnectedSocket() client: Socket,
  ): ResultPayload {
    return this.whereIsCharleyService.handleCoordonates(data, client);
  }

  handleDisconnect() {
    this.logger.info('client disconnected');
  }
}
