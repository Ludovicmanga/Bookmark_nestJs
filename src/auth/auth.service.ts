import { Injectable, ForbiddenException } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
@Injectable({})
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}
  async signIn(dto: AuthDto) {
    try {
      const foundUser = await this.prisma.user.findFirst({
        where: {
          email: dto.email,
        },
      });
      if (!foundUser) {
        throw new ForbiddenException('Credentials incorrect');
      }
      const pwMatches = await argon.verify(foundUser.hash, dto.password);
      if (!pwMatches) {
        throw new ForbiddenException('Credentials incorrect');
      }
      return this.signToken(foundUser.id, foundUser.email);
    } catch (error) {
      console.log(error, ' is the error my boy...');
    }
  }
  async signUp(dto: AuthDto) {
    try {
      const hash = await argon.hash(dto.password);
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
        },
      });

      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials taken');
        }
      }
    }
  }

  async signToken(
    userId: number,
    email: string,
  ): Promise<{
    access_token: string;
  }> {
    const payload = {
      sub: userId,
      email,
    };

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret: process.env.JWT_SECRET,
    });

    return {
      access_token: token,
    };
  }
}
