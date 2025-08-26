import {
  Body,
  Controller,
  Post,
  Res,
  Req,
  UnauthorizedException,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { RegisterDto } from '../dto/auth/register.dto';
import { LoginDto } from '../dto/auth/login.dto';
import { Response, Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { SetRefreshCookieInterceptor } from '@/common/interceptors/set-refresh-cookie.interceptor';
import { Public } from '@/common/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  @Public()
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return await this.authService.register(dto);
  }

  @Public()
  @UseInterceptors(SetRefreshCookieInterceptor)
  @Post('login')
  async login(@Body() dto: LoginDto) {
    const { user, accessToken, refreshToken } = await this.authService.login(dto.email, dto.password);
    return {
      message: '로그인 성공',
      accessToken,
      user: { id: user.userId, email: user.email, role: user.role, username: user.username },
      refreshToken,
    };
  }

  @Public()
  @Post('refresh')
  async refresh(@Req() req: Request, @Res() res: Response) {
    const token = req.cookies?.['refresh_token'];
    if (!token) throw new UnauthorizedException('리프레시 토큰 없음');

    try {
      const payload = this.jwtService.verify(token, {
        secret: this.config.get<string>('JWT_REFRESH_SECRET'),
      });

      const newAccessToken = this.jwtService.sign(
        {
          sub: payload.sub,
          email: payload.email,
          role: payload.role,
          username: payload.username,
        },
        {
          secret: this.config.get<string>('JWT_SECRET'),
          expiresIn: '15m',
        },
      );

      return res.json({ accessToken: newAccessToken });
    } catch (e) {
      throw new UnauthorizedException('리프레시 토큰 유효하지 않음');
    }
  }
}
