import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { CartModel } from './models/cart.model';
import { CartRepository } from './cart.repository';

@Module({
	imports: [
		TypegooseModule.forFeature([
			{
				typegooseClass: CartModel,
				schemaOptions: {
					collection: 'Cart',
				},
			},
		]),
	],
	controllers: [CartController],
	providers: [CartRepository, CartService],
})
export class CartModule {}
