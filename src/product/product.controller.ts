import { Controller, Get, Post, Put, Delete, Param } from '@nestjs/common';
import { ProductRepository } from './product.repository';

@Controller('product')
export class ProductController {
	constructor(private readonly productRepository: ProductRepository) {}

	@Get('all')
	async getAllProducts() {
		return [];
	}

	@Get('similar')
	async getSimilarProducts() {
		return [];
	}

	@Get('new')
	async getNewProducts() {
		return [];
	}

	@Get('popular')
	async getPopularProducts() {
		return [];
	}

	@Get(':id')
	async getProduct(@Param('id') productId: string) {
		return productId;
	}

	@Post('')
	async createProduct() {
		return {};
	}

	@Put(':id')
	async updateProduct(@Param('id') productId: string) {
		return productId;
	}

	@Delete(':id')
	async deleteProduct(@Param('id') productId: string) {
		return productId;
	}
}
