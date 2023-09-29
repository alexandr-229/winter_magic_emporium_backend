import { IsNumber, IsOptional, IsString } from 'class-validator';

export class GetSimilarDto {
	@IsOptional()
	@IsNumber()
	limit?: number;

	@IsNumber()
	price: number;

	@IsString()
	sizeUnit: string;

	@IsNumber()
	sizeValue: number;
}
