import { CartService } from '../cart.service';

const cartMock = {
	user: 'a@gmail.com',
	products: [{ productId: '1', quantity: 1 }],
};

const getCart = jest.fn().mockReturnValue(cartMock);
const createCart = jest.fn().mockReturnValue(cartMock);
const deleteProduct = jest.fn().mockReturnValue(cartMock);
const addProduct = jest.fn().mockReturnValue(cartMock);
const updateQuantity = jest.fn().mockReturnValue(cartMock);

const CartRepositoryMock = jest.fn().mockImplementation(() => ({
	getCart,
	createCart,
	deleteProduct,
	addProduct,
	updateQuantity,
}));

const cartService = new CartService(new CartRepositoryMock());

describe('Cart service', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	it('get exists cart', async () => {
		const result = await cartService.getCart(cartMock.user);

		expect(result).toEqual(cartMock);
		expect(getCart).toHaveBeenCalledTimes(1);
		expect(createCart).toHaveBeenCalledTimes(0);
	});

	it('get cart', async () => {
		getCart.mockReturnValue(null);

		const result = await cartService.getCart(cartMock.user);

		expect(result).toEqual(cartMock);
		expect(getCart).toHaveBeenCalledTimes(1);
		expect(createCart).toHaveBeenCalledTimes(1);
	});

	it('addProduct', async () => {
		const result = await cartService.addProduct(cartMock.user, '1', 1);

		expect(result).toEqual(cartMock);
		expect(deleteProduct).toHaveBeenCalledTimes(1);
		expect(addProduct).toHaveBeenCalledTimes(1);
	});

	it('deleteProduct', async () => {
		const result = await cartService.deleteProduct(cartMock.user, '1');

		expect(result).toEqual(cartMock);
		expect(deleteProduct).toHaveBeenCalledTimes(1);
	});

	it('updateQuantity', async () => {
		const result = await cartService.updateQuantity(cartMock.user, '1', 1);

		expect(result).toEqual(cartMock);
		expect(updateQuantity).toHaveBeenCalledTimes(1);
	});
});
