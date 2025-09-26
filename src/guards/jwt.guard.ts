import {
    CanActivate,
    ExecutionContext,
    Injectable,
    Logger,
    UnauthorizedException,
  } from '@nestjs/common';
  import { ConfigService } from '@nestjs/config';
  import { verify, JwtPayload } from 'jsonwebtoken';
  
  @Injectable()
  export class JwtAuthGuard implements CanActivate {
    private readonly logger = new Logger(JwtAuthGuard.name);
    
    constructor(private readonly config: ConfigService) {}
  
    canActivate(context: ExecutionContext): boolean {
      const req = context.switchToHttp().getRequest();
  
      const auth = req.headers?.authorization as string | undefined;
      if (!auth || !auth.startsWith('Bearer ')) {
        throw new UnauthorizedException(
          'Missing or invalid Authorization header',
        );
      }
  
      const token = auth.slice('Bearer '.length).trim();
      const issuer = this.config.get<string>('JWT_ISS');
      const audience = this.config.get<string>('JWT_AUD');
      const key = this.config.get<string>('JWT_KEY');
  
      if (!issuer || !audience || !key) {
        this.logger.error(
          'JWT configuration is invalid, one of issuer, audience, or key is missing',
        );
        throw new UnauthorizedException('Authorization invalid for request');
      }
  
      try {
        const payload = verify(token, key, {
          issuer,
          audience,
          algorithms: ['HS256'],
        }) as JwtPayload;
  
        const now = Math.floor(Date.now() / 1000);
        if (typeof payload?.exp !== 'number') {
          this.logger.error('Token missing exp');
          throw new UnauthorizedException('Authorization invalid for request');
        }
        if (now >= payload.exp) {
          this.logger.error('Token expired');
          throw new UnauthorizedException('Authorization invalid for request');
        }
        (req as any).user = payload;
        return true;
      } catch (e) {
        this.logger.error('Error when verifying authorization token:', e);
        throw new UnauthorizedException('Authorization invalid for request');
      }
    }
  }