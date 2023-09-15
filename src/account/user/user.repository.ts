import { Injectable } from '@nestjs/common';
import { UserModel } from './models/user.model';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { IUser } from './types/user';
import { Types } from 'mongoose';

@Injectable()
export class UserRepository {
	constructor(@InjectModel(UserModel) private readonly userModel: ModelType<UserModel>) {}

	async getUserByEmail(email: string) {
		const result = await this.userModel.findOne({ email }).exec();
		return result;
	}

	async changePersonalDataByEmail(
		email: string,
		user: Pick<IUser, 'phone' | 'name' | 'lastName'>,
	) {
		const result = await this.userModel.findOneAndUpdate({ email }, user, { new: true }).exec();

		return result;
	}

	async addFavoriteGoods(email: string, product: string) {
		const productId = new Types.ObjectId(product);
		const result = await this.userModel
			.findOneAndUpdate({ email }, { $push: { favorites: productId } }, { new: true })
			.exec();

		return result;
	}

	async removeFavoriteGoods(email: string, product: string) {
		const productId = new Types.ObjectId(product);
		const result = await this.userModel
			.findOneAndUpdate({ email }, { $pull: { favorites: productId } }, { new: true })
			.exec();

		return result;
	}
}
