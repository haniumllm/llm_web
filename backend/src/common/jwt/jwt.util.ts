import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from './jwt-payload.interface';
import {
  ACCESS_TOKEN_EXPIRY,
  REFRESH_TOKEN_EXPIRY,
  ACCESS_TOKEN_SECRET_ENV,
  REFRESH_TOKEN_SECRET_ENV,
} from './jwt.constant';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtUtil {
  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  buildPayload(user: { userId: number; email: string; role: string; username: string }): JwtPayload {
    return {
      sub: user.userId,
      email: user.email,
      role: user.role,
      username: user.username,
    };
  }


  signAccessToken(payload: JwtPayload): string {
    const secret = this.config.get<string>(ACCESS_TOKEN_SECRET_ENV);
    if (!secret) throw new Error(`Missing env: ${ACCESS_TOKEN_SECRET_ENV}`);
    return this.jwtService.sign(payload, { secret, expiresIn: ACCESS_TOKEN_EXPIRY });
  }

  signRefreshToken(payload: JwtPayload): string {
    const secret = this.config.get<string>(REFRESH_TOKEN_SECRET_ENV);
    if (!secret) throw new Error(`Missing env: ${REFRESH_TOKEN_SECRET_ENV}`);
    return this.jwtService.sign(payload, { secret, expiresIn: REFRESH_TOKEN_EXPIRY });
  }
}
