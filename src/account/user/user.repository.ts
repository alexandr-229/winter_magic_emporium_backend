import { Injectable } from '@nestjs/common';
import { UserModel } from './models/user.model';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { IUser } from './types/user';
import { Types } from 'mongoose';
import { PRODUCT_ALREADY_IN_FAVORITES, USER_NOT_FOUND } from './user.const';

@Injectable()
export class UserRepository {
	constructor(@InjectModel(UserModel) private readonly userModel: ModelType<UserModel>) {}

	async getUserByEmail(email: string) {
		const result = await this.userModel.findOne({ email }).exec();
		return result;
	}

	async changePersonalDataByEmail(
		email: string,
		user: Partial<Pick<IUser, 'phone' | 'name' | 'lastName' | 'photo'>>,
	) {
		const result = await this.userModel.findOneAndUpdate({ email }, user, { new: true }).exec();
		return result;
	}

	async addFavoriteProduct(email: string, product: string): Promise<string | true> {
		const user = await this.userModel.findOne({ email });
		if (!user) {
			return USER_NOT_FOUND;
		}

		const productExists = user.favorites.map(String).includes(product.toString());

		if (productExists) {
			return PRODUCT_ALREADY_IN_FAVORITES;
		}

		const productId = new Types.ObjectId(product);
		user.favorites.push(productId);
		await user.save();

		return true;
	}

	async removeFavoriteProduct(email: string, product: string) {
		const productId = new Types.ObjectId(product);
		const result = await this.userModel
			.findOneAndUpdate({ email }, { $pull: { favorites: productId } }, { new: true })
			.exec();

		return result;
	}

	async getFavoritesProducts(email: string) {
		const user = await this.getUserByEmail(email);
		if (!user) {
			return null;
		}
		const products = await user.populate({ path: 'favorites' });
		return products.favorites;
	}

	async getOrderHistory(email: string) {
		const user = await this.getUserByEmail(email);
		if (!user) {
			return null;
		}
		const history = await user.populate('orders.productsId');
		return history;
	}
}
