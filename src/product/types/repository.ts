import { IProduct } from './product';

export interface IGetProductsOptions {
	filters?: Partial<Omit<IProduct, '_id'>>;
	sort?: [keyof IProduct, 1 | -1][];
	pagination?: { limit: number; page: number };
}
