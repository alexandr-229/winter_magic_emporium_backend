import { IsNumber } from 'class-validator';

export class UpdateQuantityDto {
	@IsNumber()
	quantity: number;
}
