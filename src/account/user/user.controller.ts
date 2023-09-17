import {
	Body,
	Controller,
	Get,
	HttpException,
	HttpStatus,
	Post,
	Put,
	UseGuards,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/decorators/user';
import { IPayload } from '../auth/types/payload.interface';
import { ChangeProfileDto } from './dto/change.profile.dto';
import { FavoritesGoodsActions, SetFavoritesGoodsDto } from './dto/set.favorites.goods.dto';
import { UNKNOWN_ACTION, USER_NOT_FOUND } from './user.const';
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

	@UsePipes(new ValidationPipe())
	@UseGuards(AuthGuard('jwt'))
	@Post('favorites')
	async setFavoritesGoods(
		@User() { email }: IPayload,
		@Body() { action, productId }: SetFavoritesGoodsDto,
	) {
		if (action === FavoritesGoodsActions.Add) {
			const result = await this.userRepository.addFavoriteProduct(email, productId);
			if (result !== true) {
				throw new HttpException(result, HttpStatus.BAD_REQUEST);
			}
			return { message: 'OK' };
		}
		if (action === FavoritesGoodsActions.Delete) {
			const result = await this.userRepository.removeFavoriteProduct(email, productId);
			if (!result) {
				throw new HttpException(USER_NOT_FOUND, HttpStatus.NOT_FOUND);
			}
			return { message: 'OK' };
		}
		throw new HttpException(UNKNOWN_ACTION, HttpStatus.BAD_REQUEST);
	}

	@UseGuards(AuthGuard('jwt'))
	@Put('profile')
	async changeProfile(@User() { email }: IPayload, @Body() dto: ChangeProfileDto) {
		const user = await this.userRepository.getUserByEmail(email);
		if (!user) {
			throw new HttpException(USER_NOT_FOUND, HttpStatus.NOT_FOUND);
		}
		const updateProfile = new UserEntity(user).getUpdateProfile(dto);
		await this.userRepository.changePersonalDataByEmail(email, updateProfile);
		return { message: 'OK' };
	}

	@Get('orders')
	async getOrderHistory() {}
}
