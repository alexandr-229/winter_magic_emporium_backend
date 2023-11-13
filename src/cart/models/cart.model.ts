import { prop } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { Types } from 'mongoose';
import { ProductModel } from '../../product/models/product.model';

class Product {
	@prop({ unique: true, ref: () => ProductModel })
	product: Types.ObjectId;

	@prop()
	quantity: number;
}

export interface CartModel extends Base {}
export class CartModel extends TimeStamps {
	@prop({ unique: true })
	user: string;

	@prop({ type: () => [Product], default: [], _id: false, unique: true })
	products: Product[];
}
