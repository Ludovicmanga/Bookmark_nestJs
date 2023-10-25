import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import * as pactum from 'pactum';
import { PrismaService } from '../src/prisma/prisma.service';
import { AuthDto } from '../src/auth/dto/auth.dto';
import { EditUserDto } from '../src/user/dto';

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();
    await app.listen(3000);
    prisma = app.get(PrismaService);
    await prisma.cleanDb();
    pactum.request.setBaseUrl('http://localhost:3000');
  });
  afterAll(() => app.close);
  describe('Auth', () => {
    const dto: AuthDto = {
      email: 'test@gmail.com',
      password: '27071994',
    };
    describe('Sign up', () => {
      it('should sign up', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(201);
      });

      it('should throw if email empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            password: dto.password,
          })
          .expectStatus(400);
      });

      it('should throw if password empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            email: dto.email,
          })
          .expectStatus(400);
      });

      it('should throw if both password and email empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({})
          .expectStatus(400);
      });
    });
    describe('Sign in', () => {
      it('should sign in', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(dto)
          .expectStatus(200)
          .stores('userAt', 'access_token');
      });

      it('should throw if email empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            password: dto.password,
          })
          .expectStatus(400);
      });

      it('should throw if password empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            email: dto.email,
          })
          .expectStatus(400);
      });

      it('should throw if both password and email empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({})
          .expectStatus(400);
      });
    });
  });
});
describe('User', () => {
  describe('Get me', () => {
    it('should get current user', () => {
      return pactum
        .spec()
        .get('/users/me')
        .withHeaders({
          Authorization: 'Bearer $S{userAt}',
          Accept: 'application/json',
        })
        .expectStatus(200);
    });
  });
  describe('Edit User', () => {
    const dto: EditUserDto = {
      email: 'edited@gmail.com',
      firstName: 'editedName',
    };
    it('should edit user', () => {
      return pactum
        .spec()
        .patch('/users')
        .withHeaders({
          Authorization: 'Bearer $S{userAt}',
          Accept: 'application/json',
        })
        .withBody(dto)
        .expectStatus(200)
        .expectBodyContains(dto.email)
        .expectBodyContains(dto.firstName);
    });
  });
});
describe('Bookmarks', () => {
  describe('Create Bookmarks', () => {});

  describe('Get Bookmarks', () => {});

  describe('Get Bookmarks by id', () => {});

  describe('Edit Bookmarks', () => {});

  describe('Delete Bookmarks', () => {});
});
