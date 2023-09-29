import { Type } from 'class-transformer';
import {
	IsArray,
	IsEnum,
	IsNumber,
	IsObject,
	IsOptional,
	IsString,
	ValidateNested,
} from 'class-validator';
import { Tag } from '../models/product.model';

class Size {
	@IsNumber()
	value: number;

	@IsString()
	unit: string;
}

export class UpdateProductDto {
	@IsOptional()
	@IsArray()
	@IsString({ each: true })
	photos: string[];

	@IsOptional()
	@IsString()
	title: string;

	@IsOptional()
	@IsNumber()
	price: number;

	@IsOptional()
	@IsNumber()
	discounts: number;

	@IsOptional()
	@IsNumber()
	quantity: number;

	@IsOptional()
	@IsEnum(Tag)
	tag: Tag;

	@IsOptional()
	@IsObject()
	@ValidateNested()
	@Type(() => Size)
	size: Size;
}
