import { AuthEntity } from '../auth.entity';
import { IUser } from '../types/user.interface';

jest.mock('bcryptjs', () => ({
	genSalt: jest.fn().mockReturnValue(''),
	hash: jest.fn().mockReturnValue('hash'),
	compare: jest.fn().mockReturnValue(true),
}));

const defaultUser: Omit<IUser, 'level' | 'isActive'> = {
	email: 'email',
	password: 'password',
	name: 'name',
	lastName: 'lastName',
	phone: 'phone',
	code: 0,
};

describe('AuthEntity', () => {
	let authEntity: AuthEntity;
	let code: number;

	beforeAll(() => {
		authEntity = new AuthEntity(defaultUser);
	});

	it('setPassword success', async () => {
		await authEntity.setPassword('');
		expect(authEntity.password).toBe('hash');
	});

	it('comparePassword success', async () => {
		const result = await authEntity.comparePassword('');
		expect(result).toBe(true);
	});

	it('setLevel success', () => {
		authEntity.setLevel();
		expect(authEntity.level).toBeDefined();
		expect(authEntity.level).not.toBe(0);
	});

	it('setCode success', () => {
		authEntity.setCode();
		code = authEntity.code;
		expect(authEntity.code).not.toBe(defaultUser.code);
	});

	it('compareCode success', () => {
		const result = authEntity.compareCode(code);
		expect(result).toBe(true);
	});

	it('compareCode fail', () => {
		const result = authEntity.compareCode(0);
		expect(result).toBe(false);
	});
});
