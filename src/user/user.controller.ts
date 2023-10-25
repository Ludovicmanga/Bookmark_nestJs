import { Body, Controller, Get, UseGuards, Patch } from '@nestjs/common';
import { User } from '@prisma/client';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { GetUser } from '../auth/decorator';
import { EditUserDto } from './dto';
import { UserService } from './user.service';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}
  @Get('me')
  getMe(@GetUser() user: User) {
    return user;
  }

  @Patch()
  editUser(@GetUser() user: User, @Body() dto: EditUserDto) {
    console.log(dto, ' is the body received');
    return this.userService.editUser(user.id, dto);
  }
}
