import { Types } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { CartModel } from './models/cart.model';
import { ICart } from './types/cart';

@Injectable()
export class CartRepository {
	constructor(@InjectModel(CartModel) private readonly cartModel: ModelType<CartModel>) {}

	async getCart(user: string) {
		const result: ICart = await this.cartModel
			.findOne({ user })
			.populate<{ products: ICart['products'] }>('products.product')
			.exec();
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
				{ $push: { products: { product: new Types.ObjectId(productId), quantity } } },
				{ new: true },
			)
			.populate('products.product')
			.exec();
		return result;
	}

	async deleteProduct(user: string, productId: string) {
		const result = await this.cartModel
			.findOneAndUpdate(
				{ user },
				{ $pull: { products: { product: new Types.ObjectId(productId) } } },
				{ new: true },
			)
			.populate('products.product')
			.exec();
		return result;
	}

	async updateQuantity(user: string, productId: string, quantity: number) {
		const result = await this.cartModel
			.findOneAndUpdate(
				{
					user,
					products: { $elemMatch: { product: new Types.ObjectId(productId) } },
				},
				{
					$set: { 'products.$.quantity': quantity },
				},
				{ new: true },
			)
			.populate('products.product')
			.exec();
		return result;
	}
}
