import { IsNumber, IsString } from 'class-validator';

export class AddProductDto {
	@IsString()
	productId: string;

	@IsNumber()
	quantity: number;
}
