import {
  CanActivate,
  ExecutionContext,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Socket } from 'socket.io';
import { CaptchaFingerPrint } from './entities/fingerprint.entity';
import { FlappyBirdGateway } from '../gateway/flappy-bird.gateway';

@Injectable()
export class WsFingerPrintGuard implements CanActivate {
  constructor(
    @InjectRepository(CaptchaFingerPrint)
    private readonly fingerprintRepository: Repository<CaptchaFingerPrint>,
    @Inject(forwardRef(() => FlappyBirdGateway))
    private readonly flappyBirdGateway: FlappyBirdGateway,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client: Socket = context.switchToWs().getClient<Socket>();
    const ipAddress = client.handshake.address;
    const userAgent = client.handshake.headers['user-agent'];
    const time = client.handshake.time;

    let fingerprint = await this.fingerprintRepository.findOne({
      where: { ipAddress, userAgent },
    });

    if (!fingerprint) {
      fingerprint = await this.createFingerprint(ipAddress, userAgent);
    }

    if (this.isResetRequired(fingerprint)) {
      await this.resetFingerprint(fingerprint);
    }

    if (this.isToManyAttempt(fingerprint)) {
      this.flappyBirdGateway.server
        .to(client.id)
        .emit('TOO_MANY_ATTEMPTS', 'CONNEXION REFUSED');
      console.error('Too many attempts');
      client.disconnect(true);
      return false;
    }

    return true;
  }
  private async createFingerprint(
    ipAddress: string,
    userAgent: string,
  ): Promise<CaptchaFingerPrint> {
    const newFingerprint = this.fingerprintRepository.create({
      ipAddress,
      userAgent,
      lastAttempt: new Date(),
      totalFailed: 0,
    });
    return this.fingerprintRepository.save(newFingerprint);
  }
  private isResetRequired(fingerprint: CaptchaFingerPrint): boolean {
    const FIFTEEN_MINUTES = 15 * 60 * 1000;
    return (
      new Date().getTime() - fingerprint.lastAttempt.getTime() > FIFTEEN_MINUTES
    );
  }
  private async resetFingerprint(
    fingerprint: CaptchaFingerPrint,
  ): Promise<void> {
    fingerprint.totalFailed = 0;
    fingerprint.lastAttempt = new Date();
    await this.fingerprintRepository.save(fingerprint);
  }
  private isToManyAttempt(fingerprint: CaptchaFingerPrint): boolean {
    const MAX_ATTEMPTS = 10;
    return fingerprint.totalFailed >= MAX_ATTEMPTS;
  }
}
