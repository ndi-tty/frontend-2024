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
import {
  FlappyBirdService,
  UserFingerPrint,
} from '../services/flappy-bird.service';
import { WsFingerPrintGuard } from '../guards/ws-fingerprint.guard';
import { UseGuards } from '@nestjs/common';

interface Message {
  type: string;
  data: any;
}

const WIN_SCORE = 2500;

// !TODO: Add bot detection into middleware
@WebSocketGateway({ cors: true, namespace: 'flappy-bird' })
@UseGuards(WsFingerPrintGuard)
export class FlappyBirdGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(private readonly flappyBirdService: FlappyBirdService) {}

  async handleConnection(client: Socket) {
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

      if (updatedState.gameOver) {
        this.flappyBirdService.incrementTotalFailed(
          client,
          updatedState.gameOver,
        );
        this.flappyBirdService.resetGameState();
      }

      if (updatedState.score >= WIN_SCORE) {
        this.flappyBirdService.setCaptchValidated(client);
        client.emit('WON_GAME', { message: 'You won the game!' });
        client.disconnect(true);
      } else {
        client.emit('UPDATE_STATE', updatedState);
      }
    }
  }

  handleDisconnect(client: Socket) {
    this.flappyBirdService.resetGameState();
    client.emit('INITIAL_STATE', this.flappyBirdService.getInitialState());
    console.log('Client Disconnected');
  }
}
