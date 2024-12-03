import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { isbot } from 'isbot';
import { Server, Socket } from 'socket.io';
import { CaptchaService } from '../services/captcha.service';

const GRAVITY = 0.5;
const FLAP = -5;
const PIPE_WIDTH = 50; // Fixed width for pipes
const PIPE_GAP = 150; // Increased gap for easier gameplay

interface GameState {
  bird: {
    x: number;
    y: number;
    velocity: number;
    width: number;
    height: number;
  };
  pipes: { x: number; height: number }[];
  score: number;
  gameOver: boolean;
}

let initialState: GameState = {
  bird: { x: 50, y: 300, velocity: 0, width: 15, height: 15 },
  pipes: [],
  score: 0,
  gameOver: false,
};

interface Message {
  type: string;
  data: any;
}

@WebSocketGateway({ cors: true })
export class WebsocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(private readonly captchaService: CaptchaService) {}

  handleConnection(client: Socket) {
    console.log('Client connected');
    const userAgent = client.handshake.headers['user-agent'];

    if (isbot(userAgent)) {
      console.log('Bot detected, connection refused');
      client.disconnect(true);
      return;
    }

    const sessionId = this.captchaService.createSession();
    client.data.sessionId = sessionId;
    client.emit('INITIAL_STATE', initialState);
  }

  @SubscribeMessage('message')
  handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() message: string,
  ) {
    const { type, data }: Message = JSON.parse(message);
    const sessionId = client.data.sessionId;
    console.log('Session ID:', sessionId);
    if (type === 'FLAP') {
      initialState.bird.velocity = FLAP;
    }

    if (type === 'UPDATE') {
      // Update bird position
      initialState.bird.y += initialState.bird.velocity;
      initialState.bird.velocity += GRAVITY;

      // Add new pipes
      if (
        initialState.pipes.length === 0 ||
        initialState.pipes[initialState.pipes.length - 1].x < 200
      ) {
        const height = Math.random() * (500 - PIPE_GAP - 50) + 50;
        initialState.pipes.push({ x: 400, height });
      }
      initialState.pipes = initialState.pipes.map((pipe) => ({
        ...pipe,
        x: pipe.x - 3,
      }));

      // Collision detection
      initialState.pipes.forEach((pipe) => {
        if (
          initialState.bird.x + initialState.bird.width / 2 > pipe.x &&
          initialState.bird.x - initialState.bird.width / 2 <
            pipe.x + PIPE_WIDTH &&
          (initialState.bird.y - initialState.bird.height / 2 < pipe.height ||
            initialState.bird.y + initialState.bird.height / 2 >
              pipe.height + PIPE_GAP)
        ) {
          initialState.gameOver = true;
        }
      });

      // Check if bird hit the ground or ceiling
      if (
        initialState.bird.y + initialState.bird.height / 2 > 600 ||
        initialState.bird.y - initialState.bird.height / 2 < 0
      ) {
        initialState.gameOver = true;
      }

      // Score update
      initialState.score += 1;
      this.captchaService.updateScore(sessionId, initialState.score);

      client.emit('UPDATE_STATE', initialState);
    }
  }

  // @SubscribeMessage('verifyCaptcha')
  // handleVerifyCaptcha(
  //   @ConnectedSocket() client: Socket,
  //   @MessageBody() data: { sessionId: string },
  // ) {
  //   if (this.captchaService.verifySession(data.sessionId)) {
  //     client.emit('CAPTCHA_VERIFIED');
  //   } else {
  //     client.emit('CAPTCHA_FAILED');
  //     client.disconnect(true);
  //   }
  // }
  handleDisconnect(client: Socket) {
    // Reset game state
    initialState = {
      bird: { x: 50, y: 300, velocity: 0, width: 15, height: 15 },
      pipes: [],
      score: 0,
      gameOver: false,
    };
    client.emit('INITIAL_STATE', initialState);

    console.log('Client disconnected');
  }
}
