import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Tag } from './models/product.model';
import { ProductRepository } from './product.repository';
import { IProduct } from './types/product';

@Injectable()
export class ProductCronService {
	constructor(private readonly productRepository: ProductRepository) {}

	getRandomIndexes(length: number) {
		const allIndexes = Array.from({ length }, (_, index) => index);
		const selectedIndexes = [];

		while (selectedIndexes.length < 5 && allIndexes.length > 0) {
			const randomIndex = Math.floor(Math.random() * allIndexes.length);
			selectedIndexes.push(allIndexes[randomIndex]);
			allIndexes.splice(randomIndex, 1);
		}

		return selectedIndexes;
	}

	@Cron('0 0 * * 4')
	async setDiscounts() {
		await this.productRepository.updateProducts({}, { discounts: 0, tag: Tag.Available });
		const { data } = await this.productRepository.getProducts({});
		const indexes = this.getRandomIndexes(data.length);

		const ids = data
			.filter((_, index) => indexes.includes(index))
			.map(({ _id }) => _id.toString());

		for (const id of ids) {
			const discounts = Math.round(Math.random() * 10) + 10;
			await this.productRepository.updateProductById(id, { discounts, tag: Tag.Discounts });
		}
	}

	@Cron('0 0 * * 5')
	async setPopular() {
		this.update({ popular: false }, { popular: true });
	}

	@Cron('0 0 * * 6')
	async setNew() {
		this.update({ new: false }, { new: true });
	}

	async update(start: Partial<IProduct>, end: Partial<IProduct>) {
		await this.productRepository.updateProducts({}, start);
		const { data } = await this.productRepository.getProducts({});
		const indexes = this.getRandomIndexes(data.length);

		const ids = data
			.filter((_, index) => indexes.includes(index))
			.map(({ _id }) => _id.toString());

		for (const id of ids) {
			await this.productRepository.updateProductById(id, end);
		}
	}
}
