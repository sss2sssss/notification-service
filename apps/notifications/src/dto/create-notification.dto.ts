export class CreateNotificationDto {
  notificationType:
    | 'leave-balance-reminder'
    | 'monthly-payslip'
    | 'happy-birthday';
  userId: string;
  companyId: string;
}
