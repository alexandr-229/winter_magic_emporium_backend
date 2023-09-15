import { Types } from 'mongoose';
import { IOrder, IUser, PublicProfile } from './types/user';

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

	constructor(user: Omit<IUser, 'password' | 'code'>) {
		this.email = user.email;
		this.name = user.name;
		this.lastName = user.lastName;
		this.phone = user.phone;
		this.photo = user.photo;
		this.level = user.level;
		this.isActive = user.isActive;
		this.favorites = user.favorites;
		this.orders = user.orders;
	}

	getPublicProfile() {
		const result: PublicProfile = {
			email: this.email,
			name: this.name,
			lastName: this.lastName,
			phone: this.phone,
			photo: this.photo,
			level: this.level,
		};

		return result;
	}
}
