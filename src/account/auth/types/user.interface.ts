import { Types } from 'mongoose';

export interface IUser {
	email: string;
	password: string;
	name: string;
	lastName: string;
	phone: string;
	level: number;
	code: number;
	isActive: boolean;
	favorites: Types.ObjectId[];
}
