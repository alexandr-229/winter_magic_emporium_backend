import { Tag } from '../models/product.model';

export interface ISize {
	value: number;
	unit: string;
}

export interface IProduct {
	_id: string;
	photos: string[];
	title: string;
	price: number;
	discounts: number;
	quantity: number;
	tag: Tag;
	new: boolean;
	popular: boolean;
	size: ISize;
	createdAt?: Date;
	updatedAt?: Date;
}
