import { Types } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { CartModel } from './models/cart.model';

@Injectable()
export class CartRepository {
	constructor(@InjectModel(CartModel) private readonly cartModel: ModelType<CartModel>) {}

	async getCart(user: string) {
		const result = await this.cartModel.findOne({ user }).exec();
		return result;
	}

	async createCart(user: string) {
		const result = await this.cartModel.create({ user });
		return result;
	}

	async addProduct(user: string, productId: string, quantity: number) {
		const result = await this.cartModel
			.findOneAndUpdate(
				{ user },
				{ $push: { products: { productId: new Types.ObjectId(productId), quantity } } },
				{ new: true },
			)
			.exec();
		return result;
	}

	async deleteProduct(user: string, productId: string) {
		const result = await this.cartModel
			.findOneAndUpdate(
				{ user },
				{ $pull: { products: { productId: new Types.ObjectId(productId) } } },
				{ new: true },
			)
			.exec();
		return result;
	}

	async updateQuantity(user: string, productId: string, quantity: number) {
		const result = await this.cartModel
			.findOneAndUpdate(
				{
					user,
					products: { $elemMatch: { productId: new Types.ObjectId(productId) } },
				},
				{
					$set: { 'products.$.quantity': quantity },
				},
				{ new: true },
			)
			.exec();
		return result;
	}
}
