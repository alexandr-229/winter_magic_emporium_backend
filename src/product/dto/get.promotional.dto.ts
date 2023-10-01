import { Transform } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class GetPromotionalDto {
	@IsOptional()
	@IsNumber()
	@Transform(({ value }) => +value)
	limit?: number;
}
