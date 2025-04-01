import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { DatabaseModule } from '@app/common';
import { UserInfoDocument, UserInfoSchema } from './entities/user.entity';
import { UsersRepository } from './users.repository';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    DatabaseModule,
    HttpModule,
    DatabaseModule.forFeature([
      { name: UserInfoDocument.name, schema: UserInfoSchema },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
})
export class UsersModule {}
