import { AbstractDocument } from '@app/common';
import { Notification } from '@app/common/interface';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ versionKey: false })
export class UserInfoDocument extends AbstractDocument {
  @Prop({ type: String, required: true })
  companyId: string;

  @Prop({ type: String, required: true })
  firstName: string;

  @Prop({
    type: [String],
    enum: [Notification.email, Notification.ui],
    required: false,
  })
  channel?: Notification[];
}

export const UserInfoSchema = SchemaFactory.createForClass(UserInfoDocument);
