import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '@/entities/user.entity';
import { RegisterDto } from '../dto/auth/register.dto';
import { LoginDto } from '../dto/auth/login.dto';
import { ConfigService } from '@nestjs/config';
import { JwtUtil } from '@/common/jwt/jwt.util';

interface AuthLoginResult {
  user: User;
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>,
    private jwtService: JwtService,
    private config: ConfigService,
    private readonly jwtUtil: JwtUtil,
  ) {}

  // 회원가입
  async register(dto: RegisterDto) {
    const exist = await this.usersRepo.findOne({ where: { email: dto.email } });
    if (exist) throw new ConflictException('이미 존재하는 이메일입니다.');

    const hashed = await bcrypt.hash(dto.password, 10);
    const user = this.usersRepo.create({
      email: dto.email,
      username: dto.username,
      password: hashed,
      role: dto.role || 'USER',
    });
    await this.usersRepo.save(user);

    return {
      message: '회원가입 성공',
      user: {
        id: user.userId,
        email: user.email,
        role: user.role,
        username: user.username,
      },
    };
  }

  async validateUser(email: string, password: string) {
    const user = await this.usersRepo.findOne({ where: { email } });
    if (!user) return null;
    const isMatch = await bcrypt.compare(password, user.password);
    return isMatch ? user : null;
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    if (!user) throw new UnauthorizedException();

    const payload = this.jwtUtil.buildPayload(user);
    const accessToken = this.jwtUtil.signAccessToken(payload);
    const refreshToken = this.jwtUtil.signRefreshToken(payload);

    return { user, accessToken, refreshToken };
  }

  // 로그인
  // async login(email: string, password: string) {
  //   const user = await this.usersRepo.findOne({ where: { email } });
  //   if (!user) return null;

  //   const isMatch = await bcrypt.compare(password, user.password);
  //   return isMatch ? user : null;
  // }

  // generateAccessToken(user: User) {
  //   const payload = {
  //     sub: user.userId,
  //     email: user.email,
  //     role: user.role,
  //     username: user.username,
  //   };
  //   return this.jwtService.sign(payload, {
  //     secret: this.config.get<string>('JWT_SECRET'),
  //     expiresIn: '15m',
  //   });
  // }

  // generateRefreshToken(user: User) {
  //   const payload = {
  //     sub: user.userId,
  //     email: user.email,
  //     role: user.role,
  //     username: user.username,
  //   };
  //   return this.jwtService.sign(payload, {
  //     secret: this.config.get<string>('JWT_REFRESH_SECRET'),
  //     expiresIn: '7d',
  //   });
  // }
}
