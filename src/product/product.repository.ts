import { Injectable } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { ProductModel } from './models/product.model';
import { IProduct } from './types/product';
import { IGetProductsOptions, SimilarOptions } from './types/repository';

@Injectable()
export class ProductRepository {
	constructor(
		@InjectModel(ProductModel) private readonly productModel: ModelType<ProductModel>,
	) {}

	async getProducts(options: IGetProductsOptions) {
		const skip = options.pagination ? options.pagination.page * options.pagination.limit : null;
		const products = await this.productModel
			.find(options.filters || {})
			.sort(options.sort || [])
			.skip(skip)
			.limit(options.pagination?.limit || null)
			.exec();

		const total = await this.productModel.countDocuments({}).exec();
		const pages = options.pagination ? Math.ceil(total / options.pagination.limit) : 1;

		const result = {
			data: products,
			pagination: {
				total,
				pages,
				page: options.pagination ? options.pagination.page + 1 : 1,
			},
		};

		return result;
	}

	async getSimilarProducts(options: SimilarOptions) {
		const result = await this.productModel
			.find({
				'size.value': { $lte: options.sortValueRange[1], $gte: options.sortValueRange[0] },
				'size.unit': options.sortUnit,
				price: { $lte: options.priceRange[1], $gte: options.priceRange[0] },
			})
			.skip(0)
			.limit(options.limit)
			.exec();

		return result;
	}

	async getProductById(id: string) {
		const result = await this.productModel.findById(id).exec();
		return result;
	}

	async createProduct(product: Omit<IProduct, '_id' | 'new' | 'popular'>) {
		const result = await this.productModel.create(product);
		return result;
	}

	async updateProductById(id: string, product: Partial<IProduct>) {
		const { popular, _id, new: _, ...productToUpdate } = product;

		const result = await this.productModel
			.findByIdAndUpdate(id, { $set: productToUpdate }, { new: true })
			.exec();
		return result;
	}

	async deleteProductById(id: string) {
		const result = await this.productModel.findByIdAndDelete(id).exec();
		return result;
	}
}
