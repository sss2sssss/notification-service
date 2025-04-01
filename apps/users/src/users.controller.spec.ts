import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { getModelToken } from '@nestjs/mongoose';
import { UserInfoDocument } from './entities/user.entity';
import { Model, Schema } from 'mongoose';
import { UsersRepository } from './users.repository';
import { v4 } from 'uuid';
import { HttpService } from '@nestjs/axios';

describe('UsersController', () => {
  let controller: UsersController;
  let mockService: UsersService;

  beforeEach(async () => {
    const mockMongooseTokens = [
      {
        provide: getModelToken(UserInfoDocument.name),
        useValue: Model<UserInfoDocument>,
      },
      {
        provide: HttpService,
        useValue: {},
      },
    ];

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [...mockMongooseTokens, UsersService, UsersRepository],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    mockService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(mockService).toBeDefined();
  });

  it('should be create, update and get user', async () => {
    const user = new UserInfoDocument();
    const id = v4();
    const companyId = v4();
    user._id = new Schema.Types.ObjectId(id);
    user.companyId = companyId;
    user.firstName = 'Test User 1';

    jest.spyOn(mockService, 'create').mockResolvedValue(user);

    const result = await controller.create(user);

    expect(result.firstName).toBe('Test User 1');

    jest.spyOn(mockService, 'findAll').mockResolvedValue([user]);

    const allResult = await controller.findAll(companyId);

    expect(allResult.length).toBe(1);

    jest.spyOn(mockService, 'findOne').mockResolvedValue(user);

    const singleResult = await controller.findOne(companyId, id);

    expect(singleResult.firstName).toBe('Test User 1');

    user.firstName = 'Test User 123';

    jest.spyOn(mockService, 'update').mockResolvedValue(user);

    const updateResult = await controller.update(id, user);

    expect(updateResult.firstName).toBe('Test User 123');
  });

  it('should be remove user', async () => {
    const user = new UserInfoDocument();
    const id = v4();
    const companyId = v4();
    user._id = new Schema.Types.ObjectId(id);
    user.companyId = companyId;
    user.firstName = 'Test User 1';

    jest.spyOn(mockService, 'create').mockResolvedValue(user);

    const result = await controller.create(user);

    expect(result.firstName).toBe(user.firstName);

    jest.spyOn(mockService, 'remove').mockResolvedValue(user);

    const removeResult = await controller.remove(id, companyId);

    expect(removeResult.firstName).toBe('Test User 1');
  });
});
