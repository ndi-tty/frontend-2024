import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { WhereIsCharlieService } from '../services/where-is-charlie.service';
import { join } from 'path';
import { readFileSync } from 'fs';
import { parse } from 'csv-parse/sync';

interface Payload {
  text: string;
  imageBase64: string;
}

interface Coordonate {
  x: number;
  y: number;
}

interface Annotation {
  filename: string;
  width: string;
  height: string;
  class: string;
  xmin: string;
  ymin: string;
  xmax: string;
  ymax: string;
}

@WebSocketGateway({ cors: true, namespace: 'where-is-charlie' })
export class WhereIsCharlieGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  private currentAnnotation: Annotation | null = null;

  constructor(private readonly whereIsCharleyService: WhereIsCharlieService) {}

  handleConnection(client: Socket) {
    const csvPath = join(process.cwd(), 'datasets/annotations.csv');
    const csvData = readFileSync(csvPath, 'utf8');
    const records: Annotation[] = parse(csvData, {
      columns: true,
      skip_empty_lines: true,
    });

    const randomIndex = Math.floor(Math.random() * records.length);
    this.currentAnnotation = records[randomIndex];

    const imagePath = join(
      process.cwd(),
      'datasets/where-is-charlie',
      this.currentAnnotation.filename,
    );
    const imageData = readFileSync(imagePath);

    const payload: Payload = {
      text: 'test',
      imageBase64: imageData.toString('base64'),
    };
    client.emit('connection', payload);
  }

  @SubscribeMessage('coordonate')
  handleCoordonate(
    @MessageBody() data: Coordonate,
    @ConnectedSocket() client: Socket,
  ) {
    if (!this.currentAnnotation) {
      client.emit('error', { message: 'No active game session!' });
      return;
    }

    const { x, y } = data;

    // Normalize the bounding box from the annotation
    const { xmin, ymin, xmax, ymax, width, height } = this.currentAnnotation;

    const normalizedBox = {
      xmin: parseFloat(xmin) / parseFloat(width),
      ymin: parseFloat(ymin) / parseFloat(height),
      xmax: parseFloat(xmax) / parseFloat(width),
      ymax: parseFloat(ymax) / parseFloat(height),
    };

    // Check if the clicked coordinates are within the bounding box
    if (
      x >= normalizedBox.xmin &&
      x <= normalizedBox.xmax &&
      y >= normalizedBox.ymin &&
      y <= normalizedBox.ymax
    ) {
      client.emit('result', { success: true, message: 'You found Charlie!' });
    } else {
      client.emit('result', { success: false, message: 'Try again!' });
    }
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected');
  }
}
