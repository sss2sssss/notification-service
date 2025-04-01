import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { UsersModule } from '../users/src/users.module';
import { UsersService } from '../users/src/users.service';
import { v4 } from 'uuid';
import { CompanysService } from '../companys/src/companys.service';
import { CompanysModule } from '../companys/src/companys.module';
import { NotificationsModule } from '../notifications/src/notifications.module';
import { NotificationsService } from '../notifications/src/notifications.service';

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
let notificationApp: INestApplication;
let notificationsService: NotificationsService;
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
        channel: 'ui',
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
        channel: 'ui',
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
        channel: 'ui',
      })
      .expect(200);
  });

  it('Get User Info For First Company Again', () => {
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

describe('NotificationsController (e2e)', () => {
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [NotificationsModule],
    }).compile();

    notificationsService =
      moduleFixture.get<NotificationsService>(NotificationsService);
    notificationApp = moduleFixture.createNestApplication();
    await notificationApp.init();
  });

  it('Invalid Company', () => {
    return request(notificationApp.getHttpServer())
      .post('/notifications')
      .set('Accept', 'application/json')
      .send({
        notificationType: 'happy-birthday',
        userId: userBody2[0]._id,
        companyId: userBody2[0].companyId + '1',
      })
      .expect(500);
  });

  it('Channel Not Subscribe Scenario for leave-balance-reminder', () => {
    return request(notificationApp.getHttpServer())
      .post('/notifications')
      .set('Accept', 'application/json')
      .send({
        notificationType: 'leave-balance-reminder',
        userId: userBody2[0]._id,
        companyId: userBody2[0].companyId,
      })
      .expect(403);
  });

  it('Channel Not Subscribe Scenario for monthly-payslip', () => {
    return request(notificationApp.getHttpServer())
      .post('/notifications')
      .set('Accept', 'application/json')
      .send({
        notificationType: 'monthly-payslip',
        userId: userBody[0]._id,
        companyId: userBody[0].companyId,
      })
      .expect(403);
  });

  it('Happy Birthday Reminder for first company', () => {
    return request(notificationApp.getHttpServer())
      .post('/notifications')
      .set('Accept', 'application/json')
      .send({
        notificationType: 'happy-birthday',
        userId: userBody[0]._id,
        companyId: userBody[0].companyId,
      })
      .expect(201);
  });

  it('Happy Birthday Reminder for second company', () => {
    return request(notificationApp.getHttpServer())
      .post('/notifications')
      .set('Accept', 'application/json')
      .send({
        notificationType: 'happy-birthday',
        userId: userBody2[0]._id,
        companyId: userBody2[0].companyId,
      })
      .expect(201);
  });

  it('Leave Balance Reminder Scenario', () => {
    return request(notificationApp.getHttpServer())
      .post('/notifications')
      .set('Accept', 'application/json')
      .send({
        notificationType: 'leave-balance-reminder',
        userId: userBody[0]._id,
        companyId: userBody[0].companyId,
      })
      .expect(201);
  });

  it('Monthly Payslip Reminder Scenario', () => {
    return request(notificationApp.getHttpServer())
      .post('/notifications')
      .set('Accept', 'application/json')
      .send({
        notificationType: 'monthly-payslip',
        userId: userBody2[0]._id,
        companyId: userBody2[0].companyId,
      })
      .expect(201);
  });

  it('Get Notification List for First Company User, should receive two for leave + birthday', () => {
    return request(notificationApp.getHttpServer())
      .get('/notifications')
      .query({
        companyId: userBody[0].companyId,
        userId: userBody[0]._id,
      })
      .expect(200)
      .expect((resp) => {
        const body = resp?.body as any[];
        expect(body.length).toBe(2);
      });
  });

  it('Get Notification List for Second Company User, should receive one for birthday', () => {
    return request(notificationApp.getHttpServer())
      .get('/notifications')
      .query({
        companyId: userBody2[0].companyId,
        userId: userBody2[0]._id,
      })
      .expect(200)
      .expect((resp) => {
        const body = resp?.body as any[];
        expect(body.length).toBe(1);
      });
  });
});

describe('Clean Up', () => {
  afterAll(async () => {
    await companysService.removeAll();
    await companyApp.close();
    await usersService.removeAll();
    await userApp.close();
    await notificationsService.removeAll();
    await notificationApp.close();
  });

  it('Test Finish', () => {
    console.log('Test Finish');
  });
});
