import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { SigninUserDto } from './dto/signin-user.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService) {}

  async validateUser(username: string, pass: string) {
    const user = await this.usersService.findOne({ username } as any);
    if (!user) return null;
    return user;
  }

  async login(dto: SigninUserDto) {
    const user = await this.usersService.findByUsernameWithPassword(dto.username);
    if (!user) throw new UnauthorizedException('Incorrect username or password');
    const matched = await bcrypt.compare(dto.password, user.password);
    if (!matched) throw new UnauthorizedException('Incorrect username or password');

    const payload = { username: user.username, sub: user.id };
    return { access_token: this.jwtService.sign(payload) };
  }

  async signup(dto: CreateUserDto) {
    const user = await this.usersService.create(dto);
    return user;
  }
}
