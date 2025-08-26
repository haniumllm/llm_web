import { Controller, Put, Body, UseGuards, Req, UnauthorizedException } from '@nestjs/common';
import { JwtAuthGuard } from '@/common/jwt/jwt-auth.guard';
import { UsersService } from '../service/user.service';
import { UpdateUserDto } from '@/dto/auth/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

    @UseGuards(JwtAuthGuard)
    @Put('profile')
    async updateProfile(@Req() req: any, @Body() dto: UpdateUserDto) {
    console.log('req.user:', req.user);
    if (!req.user) {
        throw new UnauthorizedException('인증된 사용자가 아닙니다.');
    }
    return this.usersService.updateProfile(req.user.sub, dto);
    }

}
