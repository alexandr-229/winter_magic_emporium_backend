import { ProductCronService } from '../product.cron.service';

const dbProductsMock = {
	data: [{ _id: '1' }, { _id: '2' }, { _id: '3' }],
};

const updateProducts = jest.fn();
const getProducts = jest.fn().mockReturnValue(dbProductsMock);
const updateProductById = jest.fn();

const ProductRepositoryMock = jest.fn().mockImplementation(() => ({
	updateProducts,
	updateProductById,
	getProducts,
}));

const productCronService = new ProductCronService(new ProductRepositoryMock());

describe('Product cron service', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	it('getRandomIndexes', () => {
		const result = productCronService.getRandomIndexes(5);
		expect(result[0]).not.toBe(result[1]);
	});

	it('setDiscounts', async () => {
		await productCronService.setDiscounts();
		expect(getProducts).toHaveBeenCalledTimes(1);
		expect(updateProducts).toHaveBeenCalledTimes(1);
		expect(updateProductById).toHaveBeenCalledTimes(dbProductsMock.data.length);
	});

	it('update', async () => {
		await productCronService.update({}, {});
		expect(getProducts).toHaveBeenCalledTimes(1);
		expect(updateProducts).toHaveBeenCalledTimes(1);
		expect(updateProductById).toHaveBeenCalledTimes(dbProductsMock.data.length);
	});
});
