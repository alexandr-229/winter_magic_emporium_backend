import { TokenService } from '../token.service';
import { IPayload } from '../types/payload.interface';

const tokenMock = 'tokenMock';
const payloadMock: IPayload = {
	email: 'email',
	id: 'id',
};

const JwtServiceMock = jest.fn().mockImplementation(() => ({
	signAsync: jest.fn().mockReturnValue(tokenMock),
	verifyAsync: jest.fn().mockReturnValue(payloadMock),
	decode: jest.fn().mockReturnValue(payloadMock),
}));

describe('TokenService', () => {
	let tokenService: TokenService;

	beforeAll(() => {
		tokenService = new TokenService(new JwtServiceMock());
	});

	it('generateToken success', async () => {
		const result = await tokenService.generateToken(payloadMock.email, payloadMock.id, '');
		expect(result).toBe(tokenMock);
	});

	it('validateToken success', async () => {
		const result = await tokenService.validateToken(tokenMock);
		expect(result).toBe(true);
	});

	it('validateToken fail', async () => {
		const JwtServiceMock = jest.fn().mockImplementation(() => ({
			verifyAsync: jest.fn().mockReturnValue(false),
		}));

		const tokenService = new TokenService(new JwtServiceMock());
		const result = await tokenService.validateToken(tokenMock);

		expect(result).toBe(false);
	});

	it('decodeToken success', () => {
		const result = tokenService.decodeToken(tokenMock);
		expect(result).toEqual(payloadMock);
	});
});
