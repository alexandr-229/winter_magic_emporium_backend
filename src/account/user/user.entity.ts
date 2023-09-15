import { Types } from 'mongoose';
import { IOrder, IUser } from './types/user';

export class UserEntity implements IUser {
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
