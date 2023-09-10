import { IsNumber, IsString } from 'class-validator';

export class ActivateDto {
	@IsString()
	email: string;

	@IsNumber()
	code: number;
}
