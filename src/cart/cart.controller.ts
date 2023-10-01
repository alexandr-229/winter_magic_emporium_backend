import {
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Put,
	UseGuards,
	UsePipes,
	ValidationPipe,
	Body,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { IPayload } from 'src/account/auth/types/payload.interface';
import { User } from 'src/decorators/user';
import { CartService } from './cart.service';
import { AddProductDto } from './dto/add.product.dto';
import { UpdateQuantityDto } from './dto/update.quantity.dto';

@Controller('cart')
export class CartController {
	constructor(private readonly cartService: CartService) {}

	@UseGuards(AuthGuard('jwt'))
	@Get('')
	async getCart(@User() { email }: IPayload) {
		const result = await this.cartService.getCart(email);
		return result;
	}

	@UseGuards(AuthGuard('jwt'))
	@UsePipes(new ValidationPipe())
	@Post('product')
	async addProduct(@Body() { productId, quantity }: AddProductDto, @User() { email }: IPayload) {
		await this.cartService.getCart(email);
		const result = await this.cartService.addProduct(email, productId, quantity);
		return result;
	}

	@UseGuards(AuthGuard('jwt'))
	@Delete(':id')
	async deleteProduct(@Param('id') productId: string, @User() { email }: IPayload) {
		const result = await this.cartService.deleteProduct(email, productId);
		return result;
	}

	@UsePipes(new ValidationPipe())
	@UseGuards(AuthGuard('jwt'))
	@Put(':id')
	async editQuantity(
		@Param('id') productId: string,
		@Body() { quantity }: UpdateQuantityDto,
		@User() { email }: IPayload,
	) {
		const result = await this.cartService.updateQuantity(email, productId, quantity);
		return result;
	}
}
