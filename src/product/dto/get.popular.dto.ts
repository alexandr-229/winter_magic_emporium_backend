import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class GetPopularDto {
	@IsOptional()
	@Transform(({ value }) => +value)
	limit: number;
}
