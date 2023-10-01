import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { CartController } from './cart.controller';
import { CartModel } from './models/cart.model';
import { CartRepository } from './models/cart.repository';

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
	providers: [CartRepository],
})
export class CartModule {}
