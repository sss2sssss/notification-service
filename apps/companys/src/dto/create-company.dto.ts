import { Notification } from '@app/common/interface';

export class CreateCompanyDto {
  companyName: string;
  channel?: Notification[];
}
