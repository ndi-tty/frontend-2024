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
  ResultPayload,
  WhereIsCharlieService,
} from '../services/where-is-charlie.service';

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
  constructor(private readonly whereIsCharleyService: WhereIsCharlieService) {}

  handleConnection(client: Socket) {
    this.whereIsCharleyService.handleInitGame(client);
  }

  @SubscribeMessage(Events.START_GAME)
  handleStartGame(
    @MessageBody() data: Coordonate,
    @ConnectedSocket() client: Socket,
  ) {
    return this.whereIsCharleyService.handleStartGame(client);
  }

  @SubscribeMessage(Events.SUBMIT_COORDONATES)
  handleCoordonates(
    @MessageBody() data: Coordonate,
    @ConnectedSocket() client: Socket,
  ): ResultPayload {
    return this.whereIsCharleyService.handleCoordonates(data, client);
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected');
  }
}
