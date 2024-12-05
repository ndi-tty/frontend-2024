import { Injectable } from '@nestjs/common';
import { join } from 'path';
import { readFileSync } from 'fs';
import { Socket } from 'socket.io';
import { parse } from 'csv-parse/sync';

interface ConnectionPayload {
  attemptsLeft: number;
  imageBase64: string;
}

interface ResultPayload {
  attemptsLeft: number;
  message: string;
  success: boolean;
}

export interface Coordonate {
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

@Injectable()
export class WhereIsCharlieService {
  private currentAnnotation: Annotation;
  private attemptsLeft: number;

  handleInitGame(client: Socket) {
    this.attemptsLeft = 3;

    const csvPath = join(
      process.cwd(),
      'datasets/where-is-charlie/annotations.csv',
    );
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

    const payload: ConnectionPayload = {
      attemptsLeft: this.attemptsLeft,
      imageBase64: imageData.toString('base64'),
    };
    client.emit('connection', payload);
  }

  handleCoordonates(data: Coordonate, client: Socket) {
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
      const result: ResultPayload = {
        attemptsLeft: this.attemptsLeft,
        message: 'You found Charlie!',
        success: true,
      };
      client.emit('result', result);
    } else {
      this.attemptsLeft--;
      const result: ResultPayload = {
        attemptsLeft: this.attemptsLeft,
        message: 'Try again!',
        success: false,
      };
      client.emit('result', result);
    }
  }
}
