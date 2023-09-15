import { Module } from '@nestjs/common';
import { ProductModel } from './models/product.model';
import { TypegooseModule } from 'nestjs-typegoose';

@Module({
	imports: [
		TypegooseModule.forFeature([
			{
				typegooseClass: ProductModel,
				schemaOptions: {
					collection: 'Product',
				},
			},
		]),
	],
})
export class ProductsModule {}
