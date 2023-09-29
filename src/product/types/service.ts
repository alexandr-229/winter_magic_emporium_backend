import { IProduct } from './product';

export enum Sort {
	Asc = 'asc',
	Desc = 'desc',
}

export enum Filter {
	All = 'all',
	New = 'new',
	Popular = 'popular',
}

export interface GetProductsOptions {
	filter: Filter;
	sort?: [keyof IProduct, 1 | -1][];
	pagination?: {
		limit: number;
		page: number;
	};
}
