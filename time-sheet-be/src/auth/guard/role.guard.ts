import { UnauthorizedException } from '@nestjs/common';
import { CanActivate, ExecutionContext } from '@nestjs/common/interfaces';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { UserRole } from 'src/utils/user-role.enum';

export class RoleGuard implements CanActivate {
  private roles: string[];

  constructor(roles: string[]) {
    this.roles = roles;
  }
canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
  const ctx = context.switchToHttp();
  const request: any = ctx.getRequest<Request>();
  
  if (this.roles.includes(request.user.role)) return true;
  
  throw new UnauthorizedException()
  }
}
