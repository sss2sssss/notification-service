import { AbstractDocument } from '@app/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ versionKey: false })
export class NotificationDocument extends AbstractDocument {
  @Prop({ type: String, required: true })
  userId: string;
  @Prop({ type: String, required: true })
  companyId: string;
  @Prop({ type: String, required: true })
  subject: string;
  @Prop({ type: String, required: true })
  content: string;
  @Prop({ type: Date, required: true })
  sentDate: Date;
}

export const NotificationSchema =
  SchemaFactory.createForClass(NotificationDocument);
