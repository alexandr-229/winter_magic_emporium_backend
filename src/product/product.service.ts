import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create.product.dto';
import { GetSimilarDto } from './dto/get.similar.dto';
import { UpdateProductDto } from './dto/update.product.dto';
import { ProductRepository } from './product.repository';
import { IProduct } from './types/product';
import { Filter, GetProductsOptions } from './types/service';
import { SimilarOptions } from './types/repository';

@Injectable()
export class ProductService {
	constructor(private readonly productRepository: ProductRepository) {}

	async getProducts(options: GetProductsOptions) {
		const dbFilters: Record<Filter, Partial<Omit<IProduct, '_id'>>> = {
			[Filter.All]: {},
			[Filter.New]: { new: true },
			[Filter.Popular]: { popular: true },
		};

		const result = await this.productRepository.getProducts({
			filters: dbFilters[options.filter],
			pagination: options.pagination,
			sort: options.sort,
		});

		return result;
	}

	async getSimilarProducts(dto: GetSimilarDto) {
		const priceRange: [number, number] = [dto.price - 5, dto.price + 5];
		const sortValueRange: [number, number] = [dto.sizeValue - 5, dto.sizeValue + 5];

		if (priceRange[0] < 0) {
			priceRange[0] = 0;
		}
		if (sortValueRange[0] < 0) {
			sortValueRange[0] = 0;
		}

		const options: SimilarOptions = {
			limit: dto.limit || 50,
			priceRange,
			sortValueRange,
			sortUnit: dto.sizeUnit,
		};

		const result = await this.productRepository.getSimilarProducts(options);

		return result;
	}

	async getProduct(id: string) {
		const result = await this.productRepository.getProductById(id);
		return result;
	}

	async createProduct(dto: CreateProductDto) {
		const result = await this.productRepository.createProduct(dto);
		return result;
	}

	async updateProduct(id: string, dto: UpdateProductDto) {
		const result = await this.productRepository.updateProductById(id, dto);
		return result;
	}

	async deleteProduct(id: string) {
		const result = await this.productRepository.deleteProductById(id);
		return result;
	}
}
