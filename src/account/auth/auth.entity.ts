import { IUser } from './types/user.interface';
import { genSalt, hash, compare } from 'bcryptjs';

export class AuthEntity implements IUser {
	email: string;
	password: string;
	name: string;
	lastName: string;
	phone: string;
	level: number;
	code: number;
	isActive: boolean;

	constructor(user: Omit<IUser, 'level' | 'isActive'>) {
		this.email = user.email;
		this.password = user.password;
		this.name = user.name;
		this.lastName = user.lastName;
		this.phone = user.phone;
		this.code = user.code;
	}

	async setPassword(password: string) {
		const salt = await genSalt(10);
		const passwordHash = await hash(password, salt);
		this.password = passwordHash;
	}

	async comparePassword(password: string) {
		const result = await compare(password, this.password);
		return result;
	}

	setLevel() {
		const level = Math.round(Math.random() * 50) + 50;
		this.level = level;
	}

	setCode() {
		const code = Math.round(Math.random() * 8999) + 1000;
		this.code = code;
	}

	compareCode(code: number) {
		const result = this.code === code;
		return result;
	}
}
