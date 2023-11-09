import { CreateProductDto } from '../dto/create.product.dto';
import { GetSimilarDto } from '../dto/get.similar.dto';
import { UpdateProductDto } from '../dto/update.product.dto';
import { Tag } from '../models/product.model';
import { ProductService } from '../product.service';
import { Filter } from '../types/service';

const productsMock = {
	data: [{ _id: '1' }, { _id: '2' }],
	pagination: {
		total: 2,
		limit: 2,
		page: 0,
	},
};

const productMock = { _id: '1' };

const getProducts = jest.fn().mockReturnValue(productsMock);
const getSimilarProducts = jest.fn().mockReturnValue(productsMock);
const getProductById = jest.fn().mockReturnValue(productMock);
const createProduct = jest.fn().mockReturnValue(productMock);
const updateProductById = jest.fn().mockReturnValue(productMock);
const deleteProductById = jest.fn().mockReturnValue(productMock);

const ProductRepositoryMock = jest.fn().mockImplementation(() => ({
	getProducts,
	getSimilarProducts,
	getProductById,
	createProduct,
	updateProductById,
	deleteProductById,
}));

const productService = new ProductService(new ProductRepositoryMock());

describe('Product service', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	it('getProducts', async () => {
		const result = await productService.getProducts({ filter: Filter.All });

		expect(getProducts).toHaveBeenCalledTimes(1);
		expect(result).toEqual(productsMock);
	});

	it('getSimilarProducts', async () => {
		const dto: GetSimilarDto = {
			limit: 10,
			price: 10,
			sizeUnit: 'm',
			sizeValue: 10,
		};

		const expectedArgs = {
			limit: dto.limit || 50,
			priceRange: [5, 15],
			sortValueRange: [5, 15],
			sortUnit: dto.sizeUnit,
		};

		const result = await productService.getSimilarProducts(dto);

		expect(getSimilarProducts).toHaveBeenCalledTimes(1);
		expect(getSimilarProducts).toHaveBeenCalledWith(expectedArgs);
		expect(result).toEqual(productsMock);
	});

	it('getProduct', async () => {
		const id = '1';
		const result = await productService.getProduct(id);

		expect(result).toEqual(productMock);
		expect(getProductById).toHaveBeenCalledTimes(1);
		expect(getProductById).toHaveBeenCalledWith(id);
	});

	it('createProduct', async () => {
		const dto: CreateProductDto = {
			photos: ['1', '2'],
			title: 'title',
			price: 100,
			discounts: 10,
			quantity: 10,
			tag: Tag.Available,
			description: 'description',
			size: {
				value: 10,
				unit: 'm',
			},
		};

		const result = await productService.createProduct(dto);

		expect(result).toEqual(productMock);
		expect(createProduct).toHaveBeenCalledTimes(1);
		expect(createProduct).toHaveBeenCalledWith(dto);
	});

	it('updateProduct', async () => {
		const id = '1';
		const dto: UpdateProductDto & { popular?: boolean; new?: boolean } = {
			photos: ['1', '2'],
			title: 'title',
			price: 100,
			discounts: 10,
			quantity: 10,
			tag: Tag.Available,
			size: {
				value: 10,
				unit: 'm',
			},
		};

		const result = await productService.updateProduct(id, { ...dto, popular: true, new: true });

		expect(result).toEqual(productMock);
		expect(updateProductById).toHaveBeenCalledTimes(1);
		expect(updateProductById).toHaveBeenCalledWith(id, dto);
	});

	it('deleteProduct', async () => {
		const id = '1';
		const result = await productService.deleteProduct(id);

		expect(result).toEqual(productMock);
		expect(deleteProductById).toHaveBeenCalledTimes(1);
		expect(deleteProductById).toHaveBeenCalledWith(id);
	});
});
