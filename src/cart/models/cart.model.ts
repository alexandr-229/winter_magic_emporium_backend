import { prop } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { Types } from 'mongoose';

class Product {
	@prop()
	productId: Types.ObjectId;

	@prop()
	quantity: number;
}

export interface CartModel extends Base {}
export class CartModel extends TimeStamps {
	@prop({ unique: true })
	user: string;

	@prop({ type: () => [Product], default: [], _id: false })
	products: Product[];
}
