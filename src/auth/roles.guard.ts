import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

interface RequestUser {
  userId: number;
  email: string;
  role: string;
}
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRole = this.reflector.get<string>(
      'role',
      context.getHandler(),
    );
    if (!requiredRole) return true;

    const { user } = context.switchToHttp().getRequest<{ user: RequestUser }>();
    return user?.role === requiredRole;
  }
}
