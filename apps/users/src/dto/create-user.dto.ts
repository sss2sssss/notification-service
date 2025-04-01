export class CreateUserDto {
  companyId: string;
  firstName: string;
  channel?: 'email' | 'ui';
}
