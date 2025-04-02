import { Notification } from '@app/common/interface';

export class CreateUserDto {
  companyId: string;
  firstName: string;
  channel?: Notification[];
}
