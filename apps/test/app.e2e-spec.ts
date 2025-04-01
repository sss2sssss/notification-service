import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { UsersModule } from '../users/src/users.module';
import { UsersService } from '../users/src/users.service';
import { v4 } from 'uuid';
import { CompanysService } from '../companys/src/companys.service';
import { CompanysModule } from '../companys/src/companys.module';
import { channel } from 'diagnostics_channel';

interface CompanyModel {
  _id: string;
  companyName: string;
  channel?: 'email' | 'ui';
}
interface UserModel {
  _id: string;
  companyId: string;
  firstName: string;
  channel?: 'email' | 'ui';
}

let companysService: CompanysService;
let companyApp: INestApplication;
let userApp: INestApplication;
let usersService: UsersService;
let companyBody: CompanyModel[];
let userBody: UserModel[];
let userBody2: UserModel[];

describe('CompanysController (e2e)', () => {
  const companyName1 = `Test Company ${v4()}`;
  const companyName2 = `Test Company ${v4()}`;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [CompanysModule],
    }).compile();

    companysService = moduleFixture.get<CompanysService>(CompanysService);
    companyApp = moduleFixture.createNestApplication();
    await companyApp.init();
  });

  it('Create New Company', () => {
    return request(companyApp.getHttpServer())
      .post('/companys')
      .set('Accept', 'application/json')
      .send({
        companyName: companyName1,
        channel: 'ui',
      })
      .expect(201);
  });

  it('Dont Accept Duplicate Company', () => {
    return request(companyApp.getHttpServer())
      .post('/companys')
      .set('Accept', 'application/json')
      .send({
        companyName: companyName1,
        channel: 'ui',
      })
      .expect(403);
  });

  it('Get Company Info', () => {
    return request(companyApp.getHttpServer())
      .get('/companys')
      .expect(200)
      .expect((resp) => {
        companyBody = resp?.body as CompanyModel[];
        expect(companyBody.length).toBe(1);
      });
  });

  it('Get Single Company Info', () => {
    return request(companyApp.getHttpServer())
      .get(`/companys/${companyBody[0]._id}`)
      .expect(200);
  });

  it('Save Second Company Info', () => {
    return request(companyApp.getHttpServer())
      .post('/companys')
      .set('Accept', 'application/json')
      .send({
        companyName: companyName2,
        channel: 'email',
      })
      .expect(201);
  });

  it('Get Two Company Info', () => {
    return request(companyApp.getHttpServer())
      .get('/companys')
      .expect(200)
      .expect((resp) => {
        companyBody = resp?.body as CompanyModel[];
        expect(companyBody.length).toBe(2);
      });
  });

  it('Edit First Company Info', () => {
    return request(companyApp.getHttpServer())
      .patch(`/companys/${companyBody[0]._id}`)
      .set('Accept', 'application/json')
      .send({
        companyName: `${companyName1}-a`,
      })
      .expect(200);
  });

  it('Delete Second Company Info', () => {
    return request(companyApp.getHttpServer())
      .delete(`/companys/${companyBody[1]._id}`)
      .expect(200);
  });

  it('Save Second Company Info Again', () => {
    return request(companyApp.getHttpServer())
      .post('/companys')
      .set('Accept', 'application/json')
      .send({
        companyName: companyName2,
        channel: 'email',
      })
      .expect(201);
  });

  it('Get Two Company Info Again', () => {
    return request(companyApp.getHttpServer())
      .get('/companys')
      .expect(200)
      .expect((resp) => {
        companyBody = resp?.body as CompanyModel[];
        expect(companyBody.length).toBe(2);
      });
  });
});

describe('UsersController (e2e)', () => {
  const userName1 = `Test User 1`;
  const userName2 = `Test User ${v4()}`;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [UsersModule],
    }).compile();

    usersService = moduleFixture.get<UsersService>(UsersService);
    userApp = moduleFixture.createNestApplication();
    await userApp.init();
  });

  it('Create New User for First Company', () => {
    return request(userApp.getHttpServer())
      .post('/users')
      .set('Accept', 'application/json')
      .send({
        companyId: companyBody[0]._id,
        firstName: userName1,
        channel: 'ui'
      })
      .expect(201);
  });

  it('Get User Info For First Company', () => {
    return request(userApp.getHttpServer())
      .get('/users')
      .query({
        companyId: companyBody[0]._id,
      })
      .expect(200)
      .expect((resp) => {
        userBody = resp?.body as UserModel[];
        expect(userBody.length).toBe(1);
      });
  });

  it('Dont Accept Duplicate User', () => {
    return request(userApp.getHttpServer())
      .post('/users')
      .set('Accept', 'application/json')
      .send({
        companyId: companyBody[0]._id,
        firstName: userName1,
        channel: 'ui'
      })
      .expect(403);
  });

  it('Create New User For Second Company', () => {
    return request(userApp.getHttpServer())
      .post('/users')
      .set('Accept', 'application/json')
      .send({
        companyId: companyBody[1]._id,
        firstName: userName2,
      })
      .expect(201);
  });

  it('Get User Info For Second Company', () => {
    return request(userApp.getHttpServer())
      .get('/users')
      .query({
        companyId: companyBody[1]._id,
      })
      .expect(200)
      .expect((resp) => {
        userBody2 = resp?.body as UserModel[];
        expect(userBody2.length).toBe(1);
      });
  });

  it('Edit First User Info in First Company', () => {
    return request(userApp.getHttpServer())
      .patch(`/users/${userBody[0]._id}`)
      .set('Accept', 'application/json')
      .send({
        companyId: companyBody[0]._id,
        firstName: `$(userName1)-a`,
        channel: 'email',
      })
      .expect(200);
  });

  it('Delete Second User Info', () => {
    return request(userApp.getHttpServer())
      .delete(`/users/${userBody2[0]._id}`)
      .query({
        companyId: companyBody[0]._id,
      })
      .expect(200);
  });

  it('Save Second User Info Again', () => {
    return request(userApp.getHttpServer())
      .post('/users')
      .set('Accept', 'application/json')
      .send({
        companyId: companyBody[1]._id,
        firstName: userName2,
      })
      .expect(201);
  });

  it('Get Second User Info Again', () => {
    return request(userApp.getHttpServer())
      .get('/users')
      .query({
        companyId: companyBody[1]._id,
      })
      .expect(200)
      .expect((resp) => {
        userBody2 = resp?.body as UserModel[];
        expect(userBody2.length).toBe(1);
      });
  });
});

describe('Clean Up', () => {
  afterAll(async () => {
    await companysService.removeAll();
    await companyApp.close();
    await usersService.removeAll();
    await userApp.close();
  });

  it('Test Finish', () => {
    console.log('Test Finish');
  });
});
