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
  WhereIsCharlieService,
} from '../services/where-is-charlie.service';

@WebSocketGateway({ cors: true, namespace: 'where-is-charlie' })
export class WhereIsCharlieGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly whereIsCharleyService: WhereIsCharlieService) {}

  handleConnection(client: Socket) {
    this.whereIsCharleyService.handleInitGame(client);
  }

  @SubscribeMessage('coordonate')
  handleCoordonate(
    @MessageBody() data: Coordonate,
    @ConnectedSocket() client: Socket,
  ) {
    this.whereIsCharleyService.handleCoordonates(data, client);
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected');
  }
}
