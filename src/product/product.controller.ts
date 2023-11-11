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
	UseGuards,
	Header,
	Headers,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SharableService } from 'src/account/auth/sharable.service';
import { IPayload } from 'src/account/auth/types/payload.interface';
import { User } from 'src/decorators/user';
import { CreateProductDto } from './dto/create.product.dto';
import { GetAllProductsDto } from './dto/get.all.products.dto';
import { GetNewDto } from './dto/get.new.dto';
import { GetPopularDto } from './dto/get.popular.dto';
import { GetPromotionalDto } from './dto/get.promotional.dto';
import { GetSimilarDto } from './dto/get.similar.dto';
import { UpdateProductDto } from './dto/update.product.dto';
import { PRODUCT_NOT_FOUND } from './product.const';
import { ProductService } from './product.service';
import { Filter, GetProductsOptions } from './types/service';

@Controller('product')
export class ProductController {
	constructor(
		private readonly productService: ProductService,
		private readonly userService: SharableService,
	) {}

	@UsePipes(new ValidationPipe({ transform: true }))
	@Post('all')
	async getAllProducts(
		@Body() { page, limit, sort }: GetAllProductsDto,
		@Headers('Authorization') token: string | undefined,
	) {
		const user: IPayload | null = token
			? this.userService.getUserByToken(token.split(' ')[1])
			: null;

		const pagination = {
			page: typeof page === 'number' ? page - 1 : 0,
			limit: typeof limit === 'number' ? limit : 50,
		};

		const result = await this.productService.getProducts({
			filter: Filter.All,
			pagination,
			sort: sort?.map((item) => [item.key, item.value === 'desc' ? -1 : 1]) || [],
			userId: user?.id || null,
		});
		return result;
	}

	@UsePipes(new ValidationPipe())
	@Post('similar')
	async getSimilarProducts(
		@Body() dto: GetSimilarDto,
		@Headers('Authorization') token: string | undefined,
	) {
		const user: IPayload | null = token
			? this.userService.getUserByToken(token.split(' ')[1])
			: null;

		const result = await this.productService.getSimilarProducts(dto, user?.id || null);
		return result;
	}

	@UsePipes(new ValidationPipe())
	@Get('promotional')
	async getPromotionalProducts(
		@Query() { limit }: GetPromotionalDto,
		@Headers('Authorization') token: string | undefined,
	) {
		const user: IPayload | null = token
			? this.userService.getUserByToken(token.split(' ')[1])
			: null;

		const result = await this.productService.getProducts({
			filter: Filter.Promotional,
			userId: user?.id || null,
			pagination: {
				page: 0,
				limit: +limit || 50,
			},
		});
		return result;
	}

	@UsePipes(new ValidationPipe({ transform: true }))
	@Get('new')
	async getNewProducts(
		@Query() { limit }: GetNewDto,
		@Headers('Authorization') token: string | undefined,
	) {
		const user: IPayload | null = token
			? this.userService.getUserByToken(token.split(' ')[1])
			: null;

		const options: GetProductsOptions = {
			filter: Filter.New,
			sort: [['createdAt', 1]],
			userId: user?.id || null,
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
	async getPopularProducts(
		@Query() { limit }: GetPopularDto,
		@Headers('Authorization') token: string | undefined,
	) {
		const user: IPayload | null = token
			? this.userService.getUserByToken(token.split(' ')[1])
			: null;

		const options: GetProductsOptions = {
			filter: Filter.Popular,
			sort: [['updatedAt', 1]],
			userId: user?.id || null,
			pagination: {
				page: 0,
				limit: +limit || 0,
			},
		};

		const { data } = await this.productService.getProducts(options);
		return data;
	}

	@Get(':id')
	async getProduct(
		@Param('id') productId: string,
		@Headers('Authorization') token: string | undefined,
	) {
		const user: IPayload | null = token
			? this.userService.getUserByToken(token.split(' ')[1])
			: null;

		const result = await this.productService.getProduct(productId, user?.id || null);
		if (!result) {
			throw new HttpException(PRODUCT_NOT_FOUND, HttpStatus.NOT_FOUND);
		}
		return result;
	}

	@UseGuards(AuthGuard('jwt'))
	@UsePipes(new ValidationPipe())
	@Post('')
	async createProduct(@Body() dto: CreateProductDto) {
		const result = await this.productService.createProduct(dto);
		return result;
	}

	@UseGuards(AuthGuard('jwt'))
	@UsePipes(new ValidationPipe())
	@Put(':id')
	async updateProduct(@Param('id') productId: string, @Body() dto: UpdateProductDto) {
		const result = await this.productService.updateProduct(productId, dto);
		if (!result) {
			throw new HttpException(PRODUCT_NOT_FOUND, HttpStatus.NOT_FOUND);
		}
		return result;
	}

	@UseGuards(AuthGuard('jwt'))
	@Delete(':id')
	async deleteProduct(@Param('id') productId: string) {
		const result = await this.productService.deleteProduct(productId);
		if (!result) {
			throw new HttpException(PRODUCT_NOT_FOUND, HttpStatus.NOT_FOUND);
		}
		return { message: 'OK', id: productId };
	}
}
