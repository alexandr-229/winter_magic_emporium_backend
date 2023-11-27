import { Injectable } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { Types } from 'mongoose';
import { InjectModel } from 'nestjs-typegoose';
import { UserModel } from '../account/user/models/user.model';
import { ProductModel } from './models/product.model';
import { IProduct } from './types/product';
import { IGetProductsOptions } from './types/repository';

@Injectable()
export class ProductRepository {
	constructor(
		@InjectModel(ProductModel) private readonly productModel: ModelType<ProductModel>,
		@InjectModel(UserModel) private readonly userModel: ModelType<UserModel>,
	) {}

	async getProducts(options: IGetProductsOptions) {
		const skip = options.pagination
			? options.pagination?.page * options.pagination?.limit
			: null;
		const sortObject = (options.sort || []).reduce<{}>((acc, item) => {
			acc[item[0]] = item[1];
			return acc;
		}, {});
		const sort = Object.keys(sortObject).length ? sortObject : { _id: 1 };

		const total = await this.productModel.countDocuments({}).exec();
		const pages = options.pagination ? Math.ceil(total / options.pagination?.limit) : 1;

		const result = {
			data: [],
			pagination: {
				total,
				pages,
				page: options.pagination ? options.pagination?.page + 1 : 1,
			},
		};

		if (options.userId) {
			result.data = await this.productModel
				.aggregate()
				.match(options.filters || {})
				.sort(sort)
				.skip(skip)
				.limit(options.pagination?.limit || 50)
				.lookup({
					from: 'User',
					let: { user_id: options.userId },
					as: 'favoritesProducts',
					pipeline: [
						{
							$match: {
								_id: new Types.ObjectId(options.userId),
							},
						},
					],
				})
				.addFields({
					favoritesProducts: {
						$first: '$favoritesProducts.favorites',
					},
				})
				.addFields({
					isFavorite: {
						$in: ['$_id', '$favoritesProducts'],
					},
				})
				.project({
					favoritesProducts: 0,
				})
				.exec();
		} else {
			result.data = await this.productModel
				.aggregate()
				.match(options.filters || {})
				.match(options.filters || {})
				.sort(sort)
				.skip(skip)
				.limit(options.pagination?.limit || 50)
				.addFields({
					isFavorite: false,
				})
				.exec();
		}

		return result;
	}

	async getProductById(id: string, userId: string | null) {
		const favorites: string[] = [];

		if (userId) {
			const user = await this.userModel.findById(userId);

			if (user) {
				favorites.push(...user.favorites.map(String));
			}
		}

		const product = await this.productModel.findById(id).exec();

		if (!product) {
			return null;
		}

		return {
			...product.toJSON(),
			isFavorite: favorites.includes(id),
		};
	}

	async createProduct(product: Omit<IProduct, '_id' | 'new' | 'popular'>) {
		const result = await this.productModel.create(product);
		return result;
	}

	async updateProductById(id: string, product: Partial<IProduct>) {
		const { _id, ...productToUpdate } = product;

		const result = await this.productModel
			.findByIdAndUpdate(id, { $set: productToUpdate }, { new: true })
			.exec();
		return result;
	}

	async updateProducts(
		filters: Partial<Omit<IProduct, '_id'>>,
		update: Partial<Omit<IProduct, '_id'>>,
	) {
		const result = await this.productModel.updateMany(filters, update, { new: true });
		return result;
	}

	async deleteProductById(id: string) {
		const result = await this.productModel.findByIdAndDelete(id).exec();
		return result;
	}
}
