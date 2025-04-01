import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from '@app/common';
import { CompanyInfoDocument } from './entities/company.entity';

@Injectable()
export class CompanysRepository extends AbstractRepository<CompanyInfoDocument> {
  protected readonly logger = new Logger(CompanysRepository.name);
  constructor(
    @InjectModel(CompanyInfoDocument.name)
    protected readonly companyModel: Model<CompanyInfoDocument>,
  ) {
    super(companyModel);
  }
}
