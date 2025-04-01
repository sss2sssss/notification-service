import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { CompanysRepository } from './companys.repository';

@Injectable()
export class CompanysService {
  constructor(private readonly companysRepository: CompanysRepository) {}

  async create(createCompanyDto: CreateCompanyDto) {
    const companyNameExistsCheck = await this.existsCheck(
      createCompanyDto.companyName,
    );

    if (companyNameExistsCheck)
      throw new HttpException('Company Name Exists', HttpStatus.FORBIDDEN);

    return this.companysRepository.create({
      ...createCompanyDto,
    });
  }

  async existsCheck(companyName: string) {
    try {
      const result = await this.companysRepository.findOne({ companyName });

      return result?._id !== undefined && result?._id !== null;
    } catch (err: any) {
      if (err instanceof NotFoundException) return false;
      throw err;
    }
  }

  findAll() {
    return this.companysRepository.find({});
  }

  async findOne(_id: string) {
    try {
      return await this.companysRepository.findOne({ _id });
    } catch (err: any) {
      if (err instanceof NotFoundException)
        throw new HttpException('Company not found', HttpStatus.NOT_FOUND);
      throw err;
    }
  }

  update(_id: string, updateCompanyDto: UpdateCompanyDto) {
    return this.companysRepository.findOneAndUpdate(
      { _id },
      { $set: updateCompanyDto },
    );
  }

  remove(_id: string) {
    return this.companysRepository.findOneAndDelete({ _id });
  }

  removeAll() {
    return this.companysRepository.deleteAll();
  }
}
