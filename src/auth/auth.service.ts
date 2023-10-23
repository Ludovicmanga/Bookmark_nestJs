import { Injectable } from '@nestjs/common';

@Injectable({})
export class AuthService {
  signIn() {
    return 'I am signed up';
  }
  signUp() {
    return 'I am signed in';
  }
}
