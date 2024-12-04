import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { FlappyBirdService } from '../services/flappy-bird.service';
import { WsFingerPrintGuard } from '../guards/ws-fingerprint.guard';
import { UseGuards } from '@nestjs/common';

interface Message {
  type: string;
  data: any;
}

// !TODO: Add bot detection into middleware
@WebSocketGateway({ cors: true, namespace: 'flappy-bird' })
@UseGuards(WsFingerPrintGuard)
export class FlappyBirdGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(private readonly flappyBirdService: FlappyBirdService) {}

  handleConnection(client: Socket) {
    console.log('Client connected to Flappy Bird game');
    client.emit('INITIAL_STATE', this.flappyBirdService.getInitialState());
  }

  @SubscribeMessage('message')
  handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() message: string,
  ) {
    const { type, data }: Message = JSON.parse(message);
    if (type === 'FLAP') {
      this.flappyBirdService.flapBird();
    }

    if (type === 'UPDATE') {
      const updatedState = this.flappyBirdService.updateGameState();
      this.flappyBirdService.incrementTotalFailed(
        client,
        updatedState.gameOver,
      );
      client.emit('UPDATE_STATE', updatedState);
    }
  }

  handleDisconnect(client: Socket) {
    this.flappyBirdService.resetGameState();
    client.emit('INITIAL_STATE', this.flappyBirdService.getInitialState());
    console.log('Client disconnected');
  }
}
