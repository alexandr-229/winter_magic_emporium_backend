import { FilterQuery } from 'mongoose';

import { ProductModel } from '../models/product.model';
import { IProduct } from './product';

export interface IGetProductsOptions {
	filters?: FilterQuery<ProductModel>;
	sort?: [keyof IProduct, 1 | -1][];
	pagination?: { limit: number; page: number };
	userId: string | null;
}

export interface SimilarOptions {
	priceRange: [number, number];
	sortValueRange: [number, number];
	sortUnit: string;
	limit: number;
}
