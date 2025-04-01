import { AbstractDocument } from '@app/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ versionKey: false })
export class CompanyInfoDocument extends AbstractDocument {
  @Prop({ type: String, required: true })
  companyName: string;

  @Prop({ type: String, required: false })
  channel?: 'email' | 'ui';
}

export const CompanyInfoSchema =
  SchemaFactory.createForClass(CompanyInfoDocument);
