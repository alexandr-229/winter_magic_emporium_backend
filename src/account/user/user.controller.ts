import { Controller, Get, HttpException, HttpStatus, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/decorators/user';
import { IPayload } from '../auth/types/payload.interface';
import { USER_NOT_FOUND } from './user.const';
import { UserEntity } from './user.entity';
import { UserRepository } from './user.repository';

@Controller('user')
export class UserController {
	constructor(private readonly userRepository: UserRepository) {}

	@UseGuards(AuthGuard('jwt'))
	@Get('me')
	async getMe(@User() { email }: IPayload) {
		const user = await this.userRepository.getUserByEmail(email);
		if (!user) {
			throw new HttpException(USER_NOT_FOUND, HttpStatus.NOT_FOUND);
		}
		const profile = new UserEntity(user).getPublicProfile();
		return profile;
	}

	@UseGuards(AuthGuard('jwt'))
	@Get('favorites')
	async getFavoritesGoods(@User() { email }: IPayload) {
		const products = await this.userRepository.getFavoritesProducts(email);
		if (!products) {
			throw new HttpException(USER_NOT_FOUND, HttpStatus.NOT_FOUND);
		}
		return products;
	}

	@Post('favorites')
	async setFavoritesGoods() {}

	@Put('profile')
	async changeProfile() {}

	@Get('orders')
	async getOrderHistory() {}
}
