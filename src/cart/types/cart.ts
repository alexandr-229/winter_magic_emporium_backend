import { IProduct } from 'src/product/types/product';

export interface ICart {
	user: string;
	products: {
		quantity: number;
		product: IProduct;
	}[];
}
