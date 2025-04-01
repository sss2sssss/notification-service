export class CreateCompanyDto {
  companyName: string;
  channel?: 'email' | 'ui';
}
