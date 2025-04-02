import { AbstractDocument } from '@app/common';
import { Notification } from '@app/common/interface';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ versionKey: false })
export class CompanyInfoDocument extends AbstractDocument {
  @Prop({ type: String, required: true })
  companyName: string;

  @Prop({
    type: [String],
    enum: [Notification.email, Notification.ui],
    required: false,
  })
  channel?: Notification[];
}

export const CompanyInfoSchema =
  SchemaFactory.createForClass(CompanyInfoDocument);
