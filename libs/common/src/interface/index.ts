export enum Notification {
  email = 'email',
  ui = 'ui',
}

export interface UserInfoInterface {
  _id: string;
  companyId: string;
  firstName: string;
  channel?: Notification[];
}

export interface CompanyInfoInterface {
  _id: string;
  companyName: string;
  channel?: Notification[];
}

export interface TemplateInterface {
  subject: string;
  content: string;
  sendChannel: Notification[];
}
