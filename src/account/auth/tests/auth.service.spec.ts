import { AuthService } from '../auth.service';
import { IPayload } from '../types/payload.interface';
import { RegisterDto } from '../dto/register.dto';
import { AuthEntity } from '../auth.entity';
import { IGoogleUser } from '../types/google.user.interface';
import {
	INVALID_CODE,
	PASSWORD_INCORRECT,
	REFRESH_TOKEN_NOT_VALID,
	USER_ALREADY_EXISTS,
	USER_NOT_ACTIVATED,
	USER_NOT_FOUND,
} from '../auth.const';

jest.mock('../auth.entity.ts');

const userDbMock = { _id: '12345', isActive: true };
const tokenMock = 'tokenMock';
const payloadMock: IPayload = { email: 'email', id: 'id' };
const refreshTokenDbMock = {
	refreshToken: 'refreshToken',
	userEmail: 'userEmail',
	toJSON: () => ({ refreshToken: 'refreshToken', userEmail: 'userEmail' }),
};

const googleUserMock: IGoogleUser = {
	sub: 'sub',
	name: 'name',
	given_name: 'given_name',
	family_name: 'family_name',
	picture: 'picture',
	email: 'email',
	email_verified: true,
	locale: 'locale',
};

const deleteToken = jest.fn();

const AuthRepositoryMock = jest.fn().mockImplementation(() => ({
	createUser: jest.fn().mockReturnValue(userDbMock),
	getUserByEmail: jest.fn().mockReturnValue(userDbMock),
	getUserById: jest.fn().mockReturnValue(userDbMock),
	updateUserByEmail: jest.fn().mockReturnValue(userDbMock),
}));

const TokenRepositoryMock = jest.fn().mockImplementation(() => ({
	createToken: jest.fn().mockReturnValue(refreshTokenDbMock),
	getToken: jest.fn().mockReturnValue(refreshTokenDbMock),
	updateToken: jest.fn().mockReturnValue(refreshTokenDbMock),
	deleteToken,
}));

const AuthMailerMock = jest.fn().mockImplementation(() => ({
	sendCode: jest.fn(),
}));

const TokenServiceMock = jest.fn().mockImplementation(() => ({
	generateToken: jest.fn().mockReturnValue(tokenMock),
	validateToken: jest.fn().mockReturnValue(true),
	decodeToken: jest.fn().mockReturnValue(payloadMock),
}));

describe('AuthService', () => {
	let authService: AuthService;

	beforeAll(() => {
		(AuthEntity as jest.Mock).mockImplementation(() => ({
			setPassword: jest.fn(),
			comparePassword: jest.fn().mockReturnValue(true),
			setLevel: jest.fn(),
			setCode: jest.fn(),
			compareCode: jest.fn().mockReturnValue(true),
		}));

		authService = new AuthService(
			new AuthRepositoryMock(),
			new TokenRepositoryMock(),
			new AuthMailerMock(),
			new TokenServiceMock(),
		);
	});

	it('register success', async () => {
		const AuthRepositoryMock = jest.fn().mockImplementation(() => ({
			createUser: jest.fn().mockReturnValue(userDbMock),
			getUserByEmail: jest.fn().mockReturnValue(null),
		}));

		const authService = new AuthService(
			new AuthRepositoryMock(),
			new TokenRepositoryMock(),
			new AuthMailerMock(),
			new TokenServiceMock(),
		);

		const dto: RegisterDto = {
			email: 'email',
			password: 'password',
			name: 'name',
			lastName: 'lastName',
			phone: 'phone',
		};

		const expectedResult = {
			id: userDbMock._id,
			refreshToken: tokenMock,
		};

		const result = await authService.register(dto);

		expect(result).toEqual(expectedResult);
	});

	it('register fail', async () => {
		try {
			const dto: RegisterDto = {
				email: 'email',
				password: 'password',
				name: 'name',
				lastName: 'lastName',
				phone: 'phone',
			};

			await authService.register(dto);

			expect(true).toBe(false);
		} catch (e) {
			expect(e.message).toBe(USER_ALREADY_EXISTS);
		}
	});

	it('activate success', async () => {
		const result = await authService.activate('email', 1234);
		const expectedResult = { accessToken: tokenMock, id: userDbMock._id };

		expect(result).toEqual(expectedResult);
	});

	it('activate user not found', async () => {
		try {
			const AuthRepositoryMock = jest.fn().mockImplementation(() => ({
				getUserByEmail: jest.fn().mockReturnValue(null),
			}));

			const authService = new AuthService(
				new AuthRepositoryMock(),
				new TokenRepositoryMock(),
				new AuthMailerMock(),
				new TokenServiceMock(),
			);

			await authService.activate('email', 1234);

			expect(true).toBe(false);
		} catch (e) {
			expect(e.message).toBe(USER_NOT_FOUND);
		}
	});

	it('activate invalid code', async () => {
		try {
			(AuthEntity as jest.Mock).mockImplementation(() => ({
				compareCode: jest.fn().mockReturnValue(false),
			}));

			await authService.activate('email', 1234);

			expect(true).toBe(false);
		} catch (e) {
			expect(e.message).toBe(INVALID_CODE);
		} finally {
			(AuthEntity as jest.Mock).mockImplementation(() => ({
				setPassword: jest.fn(),
				comparePassword: jest.fn().mockReturnValue(true),
				setLevel: jest.fn(),
				setCode: jest.fn(),
				compareCode: jest.fn().mockReturnValue(true),
			}));
		}
	});

	it('login success', async () => {
		const result = await authService.login('email', 'password');
		const expectedResult = {
			response: { accessToken: tokenMock, id: userDbMock._id },
			refreshToken: refreshTokenDbMock.refreshToken,
		};

		expect(result).toEqual(expectedResult);
	});

	it('login user not found', async () => {
		try {
			const AuthRepositoryMock = jest.fn().mockImplementation(() => ({
				getUserByEmail: jest.fn().mockReturnValue(null),
			}));

			const authService = new AuthService(
				new AuthRepositoryMock(),
				new TokenRepositoryMock(),
				new AuthMailerMock(),
				new TokenServiceMock(),
			);

			await authService.login('email', 'password');

			expect(true).toBe(false);
		} catch (e) {
			expect(e.message).toBe(USER_NOT_FOUND);
		}
	});

	it('login user not activated', async () => {
		try {
			const AuthRepositoryMock = jest.fn().mockImplementation(() => ({
				getUserByEmail: jest.fn().mockReturnValue({ ...userDbMock, isActive: false }),
			}));

			const authService = new AuthService(
				new AuthRepositoryMock(),
				new TokenRepositoryMock(),
				new AuthMailerMock(),
				new TokenServiceMock(),
			);

			await authService.login('email', 'password');

			expect(true).toBe(false);
		} catch (e) {
			expect(e.message).toBe(USER_NOT_ACTIVATED);
		}
	});

	it('login password incorrect', async () => {
		try {
			(AuthEntity as jest.Mock).mockImplementation(() => ({
				comparePassword: jest.fn().mockReturnValue(false),
			}));

			await authService.login('email', 'password');

			expect(true).toBe(false);
		} catch (e) {
			expect(e.message).toBe(PASSWORD_INCORRECT);
		} finally {
			(AuthEntity as jest.Mock).mockImplementation(() => ({
				setPassword: jest.fn(),
				comparePassword: jest.fn().mockReturnValue(true),
				setLevel: jest.fn(),
				setCode: jest.fn(),
				compareCode: jest.fn().mockReturnValue(true),
			}));
		}
	});

	it('logout success', async () => {
		await authService.logout('token');
		expect(deleteToken).toHaveBeenCalledTimes(1);
	});

	it('refresh success', async () => {
		const result = await authService.refresh('token');
		const expectedResult = { accessToken: tokenMock, id: payloadMock.id };
		expect(result).toEqual(expectedResult);
	});

	it('refresh token not valid', async () => {
		try {
			const TokenServiceMock = jest.fn().mockImplementation(() => ({
				validateToken: jest.fn().mockReturnValue(false),
			}));

			const authService = new AuthService(
				new AuthRepositoryMock(),
				new TokenRepositoryMock(),
				new AuthMailerMock(),
				new TokenServiceMock(),
			);

			await authService.refresh('token');

			expect(true).toBe(false);
		} catch (e) {
			expect(e.message).toBe(REFRESH_TOKEN_NOT_VALID);
		}
	});

	it('changePassword success', async () => {
		const result = await authService.changePassword('email', 'old', 'new');
		const expectedResult = { id: userDbMock._id };

		expect(result).toEqual(expectedResult);
	});

	it('changePassword user not found', async () => {
		try {
			const AuthRepositoryMock = jest.fn().mockImplementation(() => ({
				getUserByEmail: jest.fn().mockReturnValue(null),
			}));

			const authService = new AuthService(
				new AuthRepositoryMock(),
				new TokenRepositoryMock(),
				new AuthMailerMock(),
				new TokenServiceMock(),
			);

			await authService.changePassword('email', 'old', 'new');

			expect(true).toBe(false);
		} catch (e) {
			expect(e.message).toBe(USER_NOT_FOUND);
		}
	});

	it('changePassword password incorrect', async () => {
		try {
			(AuthEntity as jest.Mock).mockImplementation(() => ({
				comparePassword: jest.fn().mockReturnValue(false),
			}));

			await authService.changePassword('email', 'old', 'new');

			expect(true).toBe(false);
		} catch (e) {
			expect(e.message).toBe(PASSWORD_INCORRECT);
		} finally {
			(AuthEntity as jest.Mock).mockImplementation(() => ({
				setPassword: jest.fn(),
				comparePassword: jest.fn().mockReturnValue(true),
				setLevel: jest.fn(),
				setCode: jest.fn(),
				compareCode: jest.fn().mockReturnValue(true),
			}));
		}
	});

	it('googleAuth user exists', async () => {
		const result = await authService.googleAuth(googleUserMock);
		const expectedResult = {
			response: { accessToken: tokenMock, id: userDbMock._id },
			refreshToken: refreshTokenDbMock.refreshToken,
		};

		expect(result).toEqual(expectedResult);
	});

	it('googleAuth user not exists', async () => {
		const AuthRepositoryMock = jest.fn().mockImplementation(() => ({
			getUserByEmail: jest.fn().mockReturnValue(null),
			createUser: jest.fn().mockReturnValue(userDbMock),
		}));

		const authService = new AuthService(
			new AuthRepositoryMock(),
			new TokenRepositoryMock(),
			new AuthMailerMock(),
			new TokenServiceMock(),
		);

		const result = await authService.googleAuth(googleUserMock);
		const expectedResult = {
			response: { accessToken: tokenMock, id: userDbMock._id },
			refreshToken: tokenMock,
		};

		expect(result).toEqual(expectedResult);
	});
});
