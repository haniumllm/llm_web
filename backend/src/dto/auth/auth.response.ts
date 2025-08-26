import { Exclude, Expose, plainToInstance } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class SafeUserDto {
  @ApiProperty() @Expose() id!: number;
  @ApiProperty() @Expose() email!: string;
  @ApiProperty() @Expose() role!: string;
  @ApiProperty() @Expose() username!: string;

  @Exclude() password?: string;
}

export class LoginResponseDto {
  @ApiProperty() @Expose() message!: string;
  @ApiProperty() @Expose() accessToken!: string;
  @ApiProperty({ type: SafeUserDto }) @Expose() user!: SafeUserDto;
}

export function toLoginResponse(
  message: string,
  accessToken: string,
  userEntity: any,
): LoginResponseDto {
  const user = plainToInstance(
    SafeUserDto,
    {
      id: userEntity.userId,
      email: userEntity.email,
      role: userEntity.role,
      username: userEntity.username,
    },
    { excludeExtraneousValues: true },
  );

  return plainToInstance(
    LoginResponseDto,
    { message, accessToken, user },
    { excludeExtraneousValues: true },
  );
}
