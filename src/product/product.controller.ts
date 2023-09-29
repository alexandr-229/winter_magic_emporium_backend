import {
	Controller,
	Get,
	Post,
	Put,
	Delete,
	Param,
	HttpException,
	HttpStatus,
	Body,
	UsePipes,
	ValidationPipe,
	Query,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create.product.dto';
import { GetAllProductsDto } from './dto/get.all.products.dto';
import { GetNewDto } from './dto/get.new.dto';
import { GetPopularDto } from './dto/get.popular.dto';
import { GetSimilarDto } from './dto/get.similar.dto';
import { UpdateProductDto } from './dto/update.product.dto';
import { ProductService } from './product.service';
import { Filter, GetProductsOptions } from './types/service';

@Controller('product')
export class ProductController {
	constructor(private readonly productService: ProductService) {}

	@UsePipes(new ValidationPipe({ transform: true }))
	@Post('all')
	async getAllProducts(@Body() { page, limit, sort }: GetAllProductsDto) {
		const pagination = {
			page: typeof page === 'number' ? page - 1 : 0,
			limit: typeof limit === 'number' ? limit : 50,
		};

		const result = await this.productService.getProducts({
			filter: Filter.All,
			pagination,
			sort: sort?.map((item) => [item.key, item.value === 'desc' ? -1 : 1]) || [],
		});
		return result;
	}

	@UsePipes(new ValidationPipe())
	@Post('similar')
	async getSimilarProducts(@Body() dto: GetSimilarDto) {
		const result = await this.productService.getSimilarProducts(dto);
		return result;
	}

	@UsePipes(new ValidationPipe({ transform: true }))
	@Get('new')
	async getNewProducts(@Query() { limit }: GetNewDto) {
		const options: GetProductsOptions = {
			filter: Filter.New,
			sort: [['createdAt', 1]],
		};

		if (typeof limit === 'number') {
			options.pagination = {
				page: 0,
				limit,
			};
		}

		const { data } = await this.productService.getProducts(options);
		return data;
	}

	@UsePipes(new ValidationPipe({ transform: true }))
	@Get('popular')
	async getPopularProducts(@Query() { limit }: GetPopularDto) {
		const options: GetProductsOptions = {
			filter: Filter.Popular,
			sort: [['updatedAt', 1]],
		};

		if (typeof limit === 'number') {
			options.pagination = {
				page: 0,
				limit,
			};
		}

		const { data } = await this.productService.getProducts(options);
		return data;
	}

	@Get(':id')
	async getProduct(@Param('id') productId: string) {
		const result = await this.productService.getProduct(productId);
		if (!result) {
			throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
		}
		return result;
	}

	@UsePipes(new ValidationPipe())
	@Post('')
	async createProduct(@Body() dto: CreateProductDto) {
		const result = await this.productService.createProduct(dto);
		return result;
	}

	@UsePipes(new ValidationPipe())
	@Put(':id')
	async updateProduct(@Param('id') productId: string, @Body() dto: UpdateProductDto) {
		const result = await this.productService.updateProduct(productId, dto);
		if (!result) {
			throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
		}
		return result;
	}

	@Delete(':id')
	async deleteProduct(@Param('id') productId: string) {
		const result = await this.productService.deleteProduct(productId);
		if (!result) {
			throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
		}
		return { message: 'OK', id: productId };
	}
}
