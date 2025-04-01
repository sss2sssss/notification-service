import { Test, TestingModule } from '@nestjs/testing';
import { CompanysController } from './companys.controller';
import { CompanysService } from './companys.service';
import { CompanysRepository } from './companys.repository';
import { CompanyInfoDocument } from './entities/company.entity';
import { getModelToken } from '@nestjs/mongoose';
import { Model, Schema } from 'mongoose';
import { v4 } from 'uuid';

describe('CompanysController', () => {
  let controller: CompanysController;
  let mockService: CompanysService;

  beforeEach(async () => {
    const mockMongooseTokens = [
      {
        provide: getModelToken(CompanyInfoDocument.name),
        useValue: Model<CompanyInfoDocument>,
      },
    ];

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompanysController],
      providers: [...mockMongooseTokens, CompanysService, CompanysRepository],
    }).compile();

    controller = module.get<CompanysController>(CompanysController);
    mockService = module.get<CompanysService>(CompanysService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(mockService).toBeDefined();
  });

  it('should be create, update and get company', async () => {
    const company = new CompanyInfoDocument();
    const id = v4();
    company._id = new Schema.Types.ObjectId(id);
    company.companyName = 'Test Company';

    jest.spyOn(mockService, 'create').mockResolvedValue(company);

    const result = await controller.create(company);

    expect(result.companyName).toBe('Test Company');

    jest.spyOn(mockService, 'findAll').mockResolvedValue([company]);

    const allResult = await controller.findAll();

    expect(allResult.length).toBe(1);

    jest.spyOn(mockService, 'findOne').mockResolvedValue(company);

    const singleResult = await controller.findOne(id);

    expect(singleResult.companyName).toBe('Test Company');

    company.companyName = 'Test Company 123';

    jest.spyOn(mockService, 'update').mockResolvedValue(company);

    const updateResult = await controller.update(id, company);

    expect(updateResult.companyName).toBe('Test Company 123');
  });

  it('should be remove company', async () => {
    const company = new CompanyInfoDocument();
    const id = v4();
    company._id = new Schema.Types.ObjectId(id);
    company.companyName = 'Test Company';

    jest.spyOn(mockService, 'create').mockResolvedValue(company);

    const result = await controller.create(company);

    expect(result.companyName).toBe(company.companyName);

    jest.spyOn(mockService, 'remove').mockResolvedValue(company);

    const removeResult = await controller.remove(id);

    expect(removeResult.companyName).toBe('Test Company');
  });
});
