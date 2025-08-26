import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatModule } from './module/chat.module';
import { AuthModule } from './module/auth.module';
import { UsersModule } from './module/user.module';
import { JwtAuthGuard } from './common/jwt/jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { BookmarkModule } from './module/bookmark.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get<string>('MYSQL_HOST'),
        port: config.get<number>('MYSQL_PORT'),
        username: config.get<string>('MYSQL_USER'),
        password: config.get<string>('MYSQL_PASSWORD'),
        database: config.get<string>('MYSQL_DATABASE'),
        autoLoadEntities: true,
        synchronize: false,  // 🚨 운영 환경에서는 false
        migrationsRun: true, // 서버 시작 시 migration 자동 실행
        migrations: [__dirname + '/../migrations/*{.ts,.js}'],
      }),
    }),

    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('MONGODB_URI'),
        dbName: 'llm_web',
      }),
    }),

    BookmarkModule,
    ChatModule,
    AuthModule,
    UsersModule,
  ],
    providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
  ],
})
export class AppModule {}
