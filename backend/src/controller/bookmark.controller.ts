import { Controller, Put, Body, UseGuards, Req, UnauthorizedException } from '@nestjs/common';
import { JwtAuthGuard } from '@/common/jwt/jwt-auth.guard';
import { BookmarkService } from '@/service/bookmark.service';

@Controller('bookmark')
export class BookmarkController {
  constructor(private readonly bookmarkService: BookmarkService) {}

    @UseGuards(JwtAuthGuard)
    @Put('profile')
    async updateProfile(@Req() req: any) {
    // console.log('req.user:', req.user);
    // if (!req.user) {
    //     throw new UnauthorizedException('인증된 사용자가 아닙니다.');
    // }
    // return this.bookmarkService.updateProfile(req.user.sub, dto);
    }

}
