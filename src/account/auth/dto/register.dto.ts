import { IsString } from 'class-validator';

export class RegisterDto {
	@IsString()
	email: string;

	@IsString()
	password: string;

	@IsString()
	name: string;

	@IsString()
	lastName: string;

	@IsString()
	phone: string;
}
