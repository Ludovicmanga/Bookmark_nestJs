import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaService } from './prisma/prisma.service';
import { PrismaController } from './prisma/prisma.controller';
import { PrismaModule } from './prisma/prisma.module';
import { BookmarkController } from './bookmark/bookmark.controller';
import { BookmarkService } from './bookmark/bookmark.service';
import { BookmarkModule } from './bookmark/bookmark.module';
@Module({
  imports: [AuthModule, UserModule, PrismaModule, BookmarkModule],
  controllers: [AppController, PrismaController, BookmarkController],
  providers: [AppService, PrismaService, BookmarkService],
})
export class AppModule {}
