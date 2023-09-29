import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class GetNewDto {
	@IsOptional()
	@Transform(({ value }) => +value)
	limit: number;
}
