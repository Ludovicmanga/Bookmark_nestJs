import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
@Injectable({})
export class AuthService {
  constructor(private prisma: PrismaService) {}
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
      return foundUser;
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
}
