import { IsString } from 'class-validator';

export class PayDto {
	@IsString()
	email: string;
}
