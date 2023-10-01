import { Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';

@Controller('cart')
export class CartController {
	@Get('')
	async getCart() {
		return {};
	}

	@Post('product')
	async addProduct() {
		return {};
	}

	@Delete(':id')
	async deleteProduct(@Param('id') id: string) {
		return id;
	}

	@Put(':id')
	async editQuantity(@Param('id') id: string) {
		return id;
	}
}
