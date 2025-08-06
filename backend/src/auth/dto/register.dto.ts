import { IsEmail, IsString, MinLength, IsOptional, IsIn, IsNotEmpty } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  username!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;

  @IsOptional()
  @IsIn(['USER', 'ADMIN'])
  role?: 'USER' | 'ADMIN';
}
