import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';
import { UpdateUserDto } from '@/dto/auth/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async updateProfile(userId: number, dto: UpdateUserDto) {
    const user = await this.userRepo.findOne({ where: { userId: userId } });
    if (!user) {
    throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }


    if (dto.username) {
      user.username = dto.username;
    }

    if (dto.password) {
      if (dto.password.length < 6) {
        throw new BadRequestException('비밀번호는 최소 6자 이상이어야 합니다.');
      }
      user.password = await bcrypt.hash(dto.password, 10);
    }

    await this.userRepo.save(user);

    return {
      message: '프로필이 수정되었습니다.',
      user: {
        email: user.email,
        username: user.username,
      },
    };
  }
}
