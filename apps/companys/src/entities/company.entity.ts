import { AbstractDocument } from '@app/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ versionKey: false })
export class CompanyInfoDocument extends AbstractDocument {
  @Prop({ type: String, required: true })
  companyName: string;
}

export const CompanyInfoSchema =
  SchemaFactory.createForClass(CompanyInfoDocument);
