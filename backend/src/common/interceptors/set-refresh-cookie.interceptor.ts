import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, map } from 'rxjs';

@Injectable()
export class SetRefreshCookieInterceptor implements NestInterceptor {
  intercept(ctx: ExecutionContext, next: CallHandler): Observable<any> {
    const res = ctx.switchToHttp().getResponse();
    return next.handle().pipe(
      map((data) => {
        if (data?.refreshToken) {
          res.cookie('refresh_token', data.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
          });
          const { refreshToken, ...rest } = data;
          return rest;
        }
        return data;
      }),
    );
  }
}
