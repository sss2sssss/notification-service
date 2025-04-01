import { Module } from '@nestjs/common';
import { CompanysService } from './companys.service';
import { CompanysController } from './companys.controller';
import { DatabaseModule } from '@app/common';
import {
  CompanyInfoDocument,
  CompanyInfoSchema,
} from './entities/company.entity';
import { CompanysRepository } from './companys.repository';

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([
      { name: CompanyInfoDocument.name, schema: CompanyInfoSchema },
    ]),
  ],
  controllers: [CompanysController],
  providers: [CompanysService, CompanysRepository],
})
export class CompanysModule {}
