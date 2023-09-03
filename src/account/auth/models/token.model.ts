import { prop } from '@typegoose/typegoose';

export class TokenModel {
	@prop()
	refreshToken: string;

	@prop()
	userEmail: string;
}
