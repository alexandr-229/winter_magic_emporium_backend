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

export class CreateProductDto {
	@IsArray()
	@IsString({ each: true })
	photos: string[];

	@IsString()
	title: string;

	@IsNumber()
	price: number;

	@IsString()
	description: string;

	@IsOptional()
	@IsNumber()
	discounts: number;

	@IsNumber()
	quantity: number;

	@IsEnum(Tag)
	tag: Tag;

	@IsObject()
	@ValidateNested()
	@Type(() => Size)
	size: Size;
}
