import { Controller, Get, Post, Put } from '@nestjs/common';

@Controller('user')
export class UserController {
	constructor() {}

	@Get('me')
	async getMe() {}

	@Get('favorites')
	async getFavoritesGoods() {}

	@Post('favorites')
	async setFavoritesGoods() {}

	@Put('profile')
	async changeProfile() {}

	@Get('orders')
	async getOrderHistory() {}
}
