import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { UserModel } from '../../user/models/user.model';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { AuthEntity } from '../auth.entity';
import { UserUpdate } from '../types/user.update.type';

@Injectable()
export class AuthRepository {
	constructor(@InjectModel(UserModel) private readonly userModel: ModelType<UserModel>) {}

	async createUser(user: AuthEntity) {
		const result = await this.userModel.create(user);
		return result;
	}

	async getUserByEmail(email: string) {
		const result = await this.userModel.findOne({ email }).exec();
		return result;
	}

	async getUserById(id: string) {
		const result = await this.userModel.findById(id).exec();
		return result;
	}

	async updateUserByEmail(email: string, user: Partial<UserUpdate>) {
		const result = await this.userModel.findOneAndUpdate({ email }, user, { new: true });
		return result;
	}
}
