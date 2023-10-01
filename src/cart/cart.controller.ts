import { Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('cart')
export class CartController {
	@UseGuards(AuthGuard('jwt'))
	@Get('')
	async getCart() {
		return {};
	}

	@UseGuards(AuthGuard('jwt'))
	@Post('product')
	async addProduct() {
		return {};
	}

	@UseGuards(AuthGuard('jwt'))
	@Delete(':id')
	async deleteProduct(@Param('id') id: string) {
		return id;
	}

	@UseGuards(AuthGuard('jwt'))
	@Put(':id')
	async editQuantity(@Param('id') id: string) {
		return id;
	}
}
