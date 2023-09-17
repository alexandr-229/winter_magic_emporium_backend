import { Types } from 'mongoose';
import { ChangeProfileDto } from './dto/change.profile.dto';
import { IOrder, IUser, PublicProfile } from './types/user';

export class UserEntity implements IUser {
	id: string;
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
		this.id = user.id;
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
			id: this.id,
			email: this.email,
			name: this.name,
			lastName: this.lastName,
			phone: this.phone,
			photo: this.photo,
			level: this.level,
		};

		return result;
	}

	getUpdateProfile(dto: ChangeProfileDto) {
		const result: Partial<Pick<IUser, 'name' | 'lastName' | 'photo' | 'phone'>> = {};

		if (dto.lastName) {
			result.lastName = dto.lastName;
		}
		if (dto.name) {
			result.name = dto.name;
		}
		if (dto.phone) {
			result.phone = dto.phone;
		}
		if (dto.photo) {
			result.photo = dto.photo;
		}

		return result;
	}
}
