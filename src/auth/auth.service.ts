import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';
@Injectable({})
export class AuthService {
  constructor(private prisma: PrismaService) {}
  signIn(dto: AuthDto) {
    return 'I am signed up with' + dto;
  }
  signUp() {
    return 'I am signed in';
  }
}
