import { Injectable } from '@nestjs/common';

interface CaptchaSession {
  id: string;
  score: number;
  verified: boolean;
}

@Injectable()
export class WhereIsCharlieService {
  private sessions = new Map<string, CaptchaSession>();

  createSession(): string {
    const id = Math.random().toString(36).substring(2, 15);
    this.sessions.set(id, { id, score: 0, verified: false });
    return id;
  }

  updateScore(id: string, score: number) {
    const session = this.sessions.get(id);
    if (session) {
      session.score = score;
    }
  }

  verifySession(id: string): boolean {
    const session = this.sessions.get(id);
    if (session && session.score >= 10) {
      // Example condition: score >= 10
      session.verified = true;
      return true;
    }
    return false;
  }

  isVerified(id: string): boolean {
    const session = this.sessions.get(id);
    return session ? session.verified : false;
  }
}
