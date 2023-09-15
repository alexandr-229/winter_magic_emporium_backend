import { Types } from 'mongoose';
import { OrderStatus } from '../models/user.model';

export interface IOrder {
	productsId: Types.ObjectId[];
	index: number;
	sum: number;
	status: OrderStatus;
	paid: boolean;
}

export interface IUser {
	email: string;
	password: string;
	name: string;
	lastName: string;
	phone: string;
	photo: string;
	level: number;
	isActive: boolean;
	code: number;
	favorites: Types.ObjectId[];
	orders: IOrder[];
}

export type PublicProfile = Pick<
	IUser,
	'email' | 'name' | 'lastName' | 'phone' | 'level' | 'photo'
>;
