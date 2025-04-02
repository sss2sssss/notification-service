import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { NotificationsRepository } from './notifications.repository';
import { CreateNotificationDto } from './dto/create-notification.dto';
import {
  CompanyInfoInterface,
  Notification,
  TemplateInterface,
  UserInfoInterface,
} from '@app/common/interface';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly httpService: HttpService,
    private readonly notificationsRepository: NotificationsRepository,
  ) {}

  async sendNotification(
    createNotificationDto: CreateNotificationDto,
    template: TemplateInterface,
  ) {
    for (const channel of template.sendChannel) {
      switch (channel) {
        case Notification.email:
          console.log('======Content For Email======');
          console.log(`Subject:`, template.subject);
          console.log(`Content:`, template.content);
          console.log('======Content For Email======');
          break;
        case Notification.ui:
          await this.notificationsRepository.create({
            userId: createNotificationDto.userId,
            companyId: createNotificationDto.companyId,
            sentDate: new Date(),
            subject: template.subject,
            content: template.content,
          });
          break;
      }
    }
  }

  async generateTemplate(
    createNotificationDto: CreateNotificationDto,
    notificationToGenerate: Notification[],
  ): Promise<TemplateInterface> {
    const companyServiceUrl = process.env.COMPANY_SERVICE_URI;
    const userServiceUrl = process.env.USER_SERVICE_URI;

    if (!userServiceUrl || !companyServiceUrl)
      throw new HttpException(
        'Error due to misconfig',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

    const result = await this.httpService.axiosRef.get<UserInfoInterface>(
      `${userServiceUrl}/${createNotificationDto.userId}?companyId=${createNotificationDto.companyId}`,
    );

    const companyResult =
      await this.httpService.axiosRef.get<CompanyInfoInterface>(
        `${companyServiceUrl}/${createNotificationDto.companyId}`,
      );

    switch (createNotificationDto.notificationType) {
      case 'leave-balance-reminder':
        return {
          subject: `Leave Reminder for User ${result?.data?.firstName}`,
          content: `You got upcoming leave on company ${companyResult?.data?.companyName}`,
          sendChannel: notificationToGenerate,
        };
      case 'monthly-payslip':
        return {
          subject: `Monthly Payslip for User ${result?.data?.firstName}`,
          content: `Here's enclose with payslip for company ${companyResult?.data?.companyName}`,
          sendChannel: notificationToGenerate,
        };
      case 'happy-birthday':
        return {
          subject: `Happy Birthday for User ${result?.data?.firstName}`,
          content: `Company ${companyResult?.data?.companyName} would wish you happy birthday!`,
          sendChannel: notificationToGenerate,
        };
    }
  }

  async getNotificationTypeToSend(
    createNotificationDto: CreateNotificationDto,
  ) {
    const companyServiceUrl = process.env.COMPANY_SERVICE_URI;
    const userServiceUrl = process.env.USER_SERVICE_URI;

    if (!userServiceUrl || !companyServiceUrl)
      throw new HttpException(
        'Error due to misconfig',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

    const result = await this.httpService.axiosRef.get<UserInfoInterface>(
      `${userServiceUrl}/${createNotificationDto.userId}?companyId=${createNotificationDto.companyId}`,
    );

    if (result?.data?._id !== createNotificationDto.userId)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    if (result?.data?.channel && result?.data?.channel?.length > 0)
      return result?.data?.channel;

    const companyResult =
      await this.httpService.axiosRef.get<CompanyInfoInterface>(
        `${companyServiceUrl}/${createNotificationDto.companyId}`,
      );

    if (companyResult?.data?._id !== createNotificationDto.companyId)
      throw new HttpException('Company not found', HttpStatus.NOT_FOUND);

    if (
      companyResult?.data?.channel &&
      companyResult?.data?.channel?.length > 0
    )
      return companyResult?.data?.channel;

    throw new HttpException('Channel not found', HttpStatus.NOT_FOUND);
  }

  async checkEligible(createNotificationDto: CreateNotificationDto) {
    const result = await this.getNotificationTypeToSend(createNotificationDto);
    switch (createNotificationDto.notificationType) {
      case 'leave-balance-reminder':
        return {
          eligible: result.includes(Notification.ui),
          notification: [Notification.ui],
        };
      case 'monthly-payslip':
        return {
          eligible: result.includes(Notification.email),
          notification: [Notification.email],
        };
      default:
        return {
          eligible: true,
          notification: result,
        };
    }
  }

  async create(createNotificationDto: CreateNotificationDto) {
    const checkEligibleResult = await this.checkEligible(createNotificationDto);

    if (!checkEligibleResult.eligible)
      throw new HttpException(
        'User not eligible to send notification',
        HttpStatus.FORBIDDEN,
      );

    const template = await this.generateTemplate(
      createNotificationDto,
      checkEligibleResult.notification,
    );

    await this.sendNotification(createNotificationDto, template);

    return {
      result: 'ok',
    };
  }

  findAll(companyId: string, userId: string) {
    return this.notificationsRepository.find({ companyId, userId });
  }

  removeAll() {
    return this.notificationsRepository.deleteAll();
  }
}
