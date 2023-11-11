import { IProduct } from './product';

export enum Sort {
	Asc = 'asc',
	Desc = 'desc',
}

export enum Filter {
	All = 'all',
	New = 'new',
	Popular = 'popular',
	Promotional = 'promotional',
}

export interface GetProductsOptions {
	filter: Filter;
	sort?: [keyof IProduct, 1 | -1][];
	userId: string | null;
	pagination?: {
		limit: number;
		page: number;
	};
}
