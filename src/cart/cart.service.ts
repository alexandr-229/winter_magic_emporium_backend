import { Injectable } from '@nestjs/common';
import { CartRepository } from './cart.repository';

@Injectable()
export class CartService {
	constructor(private readonly cartRepository: CartRepository) {}

	async getCart(user: string) {
		const cart = await this.cartRepository.getCart(user);

		if (!cart) {
			const result = await this.cartRepository.createCart(user);
			return result;
		}

		return cart;
	}

	async addProduct(user: string, productId: string, quantity: number) {
		await this.cartRepository.deleteProduct(user, productId);
		const result = await this.cartRepository.addProduct(user, productId, quantity);
		return result;
	}

	async deleteProduct(user: string, productId: string) {
		const result = await this.cartRepository.deleteProduct(user, productId);
		return result;
	}

	async updateQuantity(user: string, productId: string, quantity: number) {
		const result = await this.cartRepository.updateQuantity(user, productId, quantity);
		return result;
	}
}
