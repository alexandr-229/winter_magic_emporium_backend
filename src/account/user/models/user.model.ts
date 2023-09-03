import { prop } from '@typegoose/typegoose';

export class UserModel {
	@prop()
	email: string;

	@prop()
	password: string;

	@prop()
	name: string;

	@prop()
	lastName: string;

	@prop()
	phone: string;

	@prop()
	photo: string;

	@prop()
	level: number;

	@prop()
	isActive: boolean;
}
