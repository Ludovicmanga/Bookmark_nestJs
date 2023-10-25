import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BookmarkService {
  constructor(private prisma: PrismaService) {}
  async getBookmarks(userId: number) {
    try {
      const foundBookmarks = await this.prisma.bookmark.findMany({
        where: {
          UserId: userId,
        },
      });
      return foundBookmarks;
    } catch (e) {
      console.log(e, ' is the damn error...');
    }
  }

  async getBookmarkByID(userId: number, bookmarkId: number) {
    try {
      return await this.prisma.bookmark.findUnique({
        where: {
          UserId: userId,
          id: bookmarkId,
        },
      });
    } catch (e) {}
  }

  async createBookmark(userId: number, dto: CreateBookmarkDto) {
    try {
      return await this.prisma.bookmark.create({
        data: {
          ...dto,
          UserId: userId,
        },
      });
    } catch (e) {
      console.log(e, ' is the error that was made');
    }
  }

  async editBookmarkByID(
    userId: number,
    bookmarkId: number,
    dto: EditBookmarkDto,
  ) {
    try {
      const bookmark = await this.prisma.bookmark.findUnique({
        where: {
          id: bookmarkId,
        },
      });
      if (bookmark.UserId !== userId) {
        throw new ForbiddenException('Access to resource denied');
      }

      return this.prisma.bookmark.update({
        where: {
          id: bookmark.id,
        },
        data: dto,
      });
    } catch (e) {}
  }

  async deleteBookmarkByID(userId: number, bookmarkId: number) {
    try {
      const bookmark = await this.prisma.bookmark.findUnique({
        where: {
          id: bookmarkId,
        },
      });
      if (bookmark.UserId !== userId) {
        throw new ForbiddenException('Access to resource denied');
      }
      await this.prisma.bookmark.delete({
        where: {
          id: bookmarkId,
        },
      });
    } catch (e) {}
  }
}
