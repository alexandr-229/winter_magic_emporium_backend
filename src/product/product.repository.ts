import { Injectable } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { ProductModel } from './models/product.model';
import { IProduct } from './types/product';
import { IGetProductsOptions } from './types/repository';

@Injectable()
export class ProductRepository {
	constructor(
		@InjectModel(ProductModel) private readonly productModel: ModelType<ProductModel>,
	) {}

	async getProducts(options: IGetProductsOptions) {
		const products = await this.productModel
			.find(options.filters || {})
			.sort(options.sort || [])
			.limit(options.pagination?.limit || null)
			.skip(options.pagination?.page || null)
			.exec();

		const total = await this.productModel.countDocuments({}).exec();
		const pages = options.pagination ? Math.ceil(total / options.pagination.limit) : 1;

		const result = {
			data: products,
			pagination: {
				total,
				pages,
				page: options.pagination ? options.pagination.page : 1,
			},
		};

		return result;
	}

	async getProductById(id: string) {
		const result = await this.productModel.findById(id).exec();
		return result;
	}

	async createProduct(product: Omit<IProduct, '_id'>) {
		const result = await this.productModel.create(product);
		return result;
	}

	async updateProductById(id: string, product: Partial<Omit<IProduct, '_id'>>) {
		const result = await this.productModel
			.findByIdAndUpdate(id, { $set: product }, { new: true })
			.exec();
		return result;
	}

	async deleteProductById(id: string) {
		const result = await this.productModel.findByIdAndDelete(id).exec();
		return result;
	}
}
