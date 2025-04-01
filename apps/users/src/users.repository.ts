import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from '@app/common';
import { UserInfoDocument } from './entities/user.entity';

@Injectable()
export class UsersRepository extends AbstractRepository<UserInfoDocument> {
  protected readonly logger = new Logger(UsersRepository.name);
  constructor(
    @InjectModel(UserInfoDocument.name)
    protected readonly userModel: Model<UserInfoDocument>,
  ) {
    super(userModel);
  }
}
