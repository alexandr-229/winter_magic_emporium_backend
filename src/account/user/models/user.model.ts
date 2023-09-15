import { prop } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { Types } from 'mongoose';

export enum OrderStatus {
	Delivered = 'Delivered',
	Processing = 'Processing',
	Completed = 'Completed',
}

export interface Order extends Base {}
export class Order extends TimeStamps {
	@prop({ type: [Types.ObjectId], _id: false })
	productsId: Types.ObjectId[];

	@prop()
	index: number;

	@prop()
	sum: number;

	@prop({ enum: OrderStatus })
	status: OrderStatus;

	@prop()
	paid: boolean;
}

export interface UserModel extends Base {}
export class UserModel extends TimeStamps {
	@prop()
	email: string;

	@prop()
	password: string;

	@prop()
	name: string;

	@prop()
	lastName: string;

	@prop()
	phone: string;

	@prop()
	photo: string;

	@prop()
	level: number;

	@prop({ default: false })
	isActive: boolean;

	@prop()
	code: number;

	@prop({ type: () => [Types.ObjectId], _id: false })
	favorites: Types.ObjectId[];

	@prop({ type: () => [Order] })
	orders: Order[];
}
