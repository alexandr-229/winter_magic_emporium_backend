import { Injectable } from '@nestjs/common';

import { UserRepository } from 'src/account/user/user.repository';
import { CartService } from 'src/cart/cart.service';
import { START_INDEX_POINT } from './constants/order';
import { Order, OrderStatus } from 'src/account/user/models/user.model';
import { isObjectId } from 'src/shared/types/mongo';
import { ICart } from 'src/cart/types/cart';
import { Types } from 'mongoose';

@Injectable()
export class PaymentService {
	constructor(
		private readonly cartService: CartService,
		private readonly userRepository: UserRepository,
	) {}

	private getOrderStatus() {
		const idx = Math.floor(Math.random() * 3);
		const statuses: Record<number, OrderStatus> = {
			[0]: OrderStatus.Completed,
			[1]: OrderStatus.Delivered,
			[2]: OrderStatus.Processing,
		};

		return statuses[idx] || statuses[0];
	}

	async addOrderToOrderHistory(email: string) {
		const cart = (await this.cartService.getCart(email)) as ICart;
		const user = await this.userRepository.getUserByEmail(email);

		if (!user || !cart) {
			return null;
		}

		const ordersIndexes = user.orders.map(({ index }) => index).concat(START_INDEX_POINT);
		const lastOrderIndex = Math.max(...ordersIndexes) + 1;

		const sum = cart.products.reduce<number>(
			(acc, { product, quantity }) => (acc += product.price * quantity),
			0,
		);

		const order: Omit<Order, 'id' | '_id'> = {
			products: cart.products.map(({ product }) => new Types.ObjectId(product._id)),
			index: lastOrderIndex,
			status: this.getOrderStatus(),
			paid: true,
			sum,
		};

		const result = await this.userRepository.saveOrder(email, order);

		return result;
	}
}
