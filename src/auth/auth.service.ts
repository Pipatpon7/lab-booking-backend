import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(email: string, password: string, fullName: string) {
    const existing = await this.usersService.findByEmail(email);
    if (existing) throw new ConflictException('Email นี้ถูกใช้แล้ว');

    const hashed = await bcrypt.hash(password, 10);
    const user = await this.usersService.create({
      email,
      password: hashed,
      fullName,
      role: 'student',
    });

    return { message: 'สมัครสมาชิกสำเร็จ', userId: user.id };
  }
  async registerAdmin(email: string, password: string, fullName: string) {
    const existing = await this.usersService.findByEmail(email);
    if (existing) throw new ConflictException('Email นี้ถูกใช้แล้ว');

    const hashed = await bcrypt.hash(password, 10);
    const user = await this.usersService.create({
      email,
      password: hashed,
      fullName,
      role: 'admin',
    });

    return { message: 'สร้าง admin สำเร็จ', userId: user.id };
  }

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('ไม่พบ email นี้');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('รหัสผ่านไม่ถูกต้อง');

    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      role: user.role,
      fullName: user.fullName,
    };
  }
}
