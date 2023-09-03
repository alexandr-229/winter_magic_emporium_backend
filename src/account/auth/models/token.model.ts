import { Types } from 'mongoose';
import { prop } from '@typegoose/typegoose';

export class TokenModel {
	@prop()
	refreshToken: string;

	@prop()
	userId: Types.ObjectId;
}
