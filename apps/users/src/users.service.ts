import { HttpService } from '@nestjs/axios';
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CompanyInfoInterface } from '@app/common/interface';

@Injectable()
export class UsersService {
  constructor(
    private readonly httpService: HttpService,
    private readonly usersRepository: UsersRepository,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const companyServiceUrl = process.env.COMPANY_SERVICE_URI;

    if (!companyServiceUrl)
      throw new HttpException(
        'Error due to misconfig',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

    const result = await this.httpService.axiosRef.get<CompanyInfoInterface>(
      `${companyServiceUrl}/${createUserDto.companyId}`,
    );

    if (result?.data?._id !== createUserDto.companyId)
      throw new HttpException('Company not found', HttpStatus.NOT_FOUND);

    const userNameExistsCheck = await this.existsCheck(createUserDto.firstName);

    if (userNameExistsCheck)
      throw new HttpException('User Name Exists', HttpStatus.FORBIDDEN);

    return this.usersRepository.create({
      ...createUserDto,
    });
  }

  async existsCheck(firstName: string) {
    try {
      const result = await this.usersRepository.findOne({ firstName });

      return result?._id !== undefined && result?._id !== null;
    } catch (err: any) {
      if (err instanceof NotFoundException) return false;
      throw err;
    }
  }

  async findOne(_id: string, companyId: string) {
    try {
      return await this.usersRepository.findOne({ _id, companyId });
    } catch (err: any) {
      if (err instanceof NotFoundException)
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      throw err;
    }
  }

  findAll(companyId: string) {
    return this.usersRepository.find({ companyId });
  }

  async update(_id: string, updateUserDto: UpdateUserDto) {
    try {
      await this.findOne(_id, updateUserDto.companyId);

      return this.usersRepository.findOneAndUpdate(
        { _id },
        { $set: updateUserDto },
      );
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_: any) {
      throw new HttpException(
        'Company/ User Not Found',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async remove(_id: string, companyId: string) {
    const companyServiceUrl = process.env.COMPANY_SERVICE_URI;

    if (!companyServiceUrl)
      throw new HttpException(
        'Error due to misconfig',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

    const result = await this.httpService.axiosRef.get<CompanyInfoInterface>(
      `${companyServiceUrl}/${companyId}`,
    );

    if (result?.data?._id !== companyId)
      throw new HttpException('Company not found', HttpStatus.NOT_FOUND);

    return this.usersRepository.findOneAndDelete({ _id });
  }

  removeAll() {
    return this.usersRepository.deleteAll();
  }
}
