import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { IProduct } from '../types/product';
import { Sort } from '../types/service';

class SortItem {
	@IsString()
	key: keyof IProduct;

	@IsEnum(Sort)
	value: Sort;
}

export class GetAllProductsDto {
	@IsOptional()
	@IsNumber()
	page: number;

	@IsOptional()
	@IsNumber()
	limit: number;

	@IsOptional()
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => SortItem)
	sort: SortItem[];
}
