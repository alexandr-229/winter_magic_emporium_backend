import { prop } from '@typegoose/typegoose';
import { TimeStamps, Base } from '@typegoose/typegoose/lib/defaultClasses';

export interface TokenModel extends Base {}
export class TokenModel extends TimeStamps {
	@prop()
	refreshToken: string;

	@prop()
	userEmail: string;
}
