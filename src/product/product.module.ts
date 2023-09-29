import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductModel } from './models/product.model';
import { TypegooseModule } from 'nestjs-typegoose';
import { ProductRepository } from './product.repository';
import { ProductService } from './product.service';

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
	controllers: [ProductController],
	providers: [ProductRepository, ProductService],
})
export class ProductModule {}
