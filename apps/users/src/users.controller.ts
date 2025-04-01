import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll(@Query('companyId') companyId: string) {
    return this.usersService.findAll(companyId);
  }

  @Get(':id')
  findOne(@Query('companyId') companyId: string, @Param('id') id: string) {
    return this.usersService.findOne(id, companyId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Query('companyId') companyId: string, @Param('id') id: string) {
    return this.usersService.remove(id, companyId);
  }
}
