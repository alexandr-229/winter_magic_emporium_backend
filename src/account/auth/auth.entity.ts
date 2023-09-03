import { Injectable } from '@nestjs/common';
import { IUser } from './types/user.interface';
import { genSalt, hash, compare } from 'bcryptjs';

@Injectable()
export class AuthEntity implements IUser {
	email: string;
	password: string;
	name: string;

	constructor(user: IUser) {
		this.email = user.email;
		this.password = user.password;
		this.name = user.name;
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
}
