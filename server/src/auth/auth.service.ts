import { UserEntity } from 'src/user/entities/user.entity';
import { CreateUserDto } from './../user/dto/create-user.dto';
import {
  Injectable,
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(user: UserEntity) {
    return await this.generateToken(user);
  }

  async register(userDto: CreateUserDto) {
    console.log(userDto);
    const candidate = await this.userService.getUserByEmail(userDto.email);
    console.log(candidate, userDto);
    if (candidate !== null) {
      throw new HttpException(
        'Пользователь с таким email уже существует',
        HttpStatus.BAD_REQUEST,
      );
    }
    const user = await this.userService.createUser({
      ...userDto,
    });
    return this.generateToken(user);
  }

  async generateToken(user: UserEntity) {
    const { password, ...userInfo } = user;
    const payload = {
      email: user.email,
      roles: user.roles,
      sub: user.id,
    };
    return {
      ...userInfo,
      access_token: this.jwtService.sign(payload),
    };
  }

  async validateUser(userDto: LoginUserDto) {
    const user = await this.userService.getUserByEmail(userDto.email);
    if (!user) {
      throw new UnauthorizedException({
        message: 'Пользователя с таким email не существует',
      });
    }
    const passwordEquals = await bcrypt.compare(
      userDto.password,
      user.password,
    );
    console.log(user);
    if (user && passwordEquals) {
      const { password, ...result } = user;
      return result;
    }
    throw new UnauthorizedException({
      message: 'Некорректный email или пароль',
    });
  }
}
