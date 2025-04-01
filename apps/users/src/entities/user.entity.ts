import { AbstractDocument } from '@app/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ versionKey: false })
export class UserInfoDocument extends AbstractDocument {
  @Prop({ type: String, required: true })
  companyId: string;

  @Prop({ type: String, required: true })
  firstName: string;

  @Prop({ type: String, required: false })
  channel?: 'email' | 'ui';
}

export const UserInfoSchema = SchemaFactory.createForClass(UserInfoDocument);
