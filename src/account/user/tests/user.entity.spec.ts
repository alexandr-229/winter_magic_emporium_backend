import { ChangeProfileDto } from '../dto/change.profile.dto';
import { IUser } from '../types/user';
import { UserEntity } from '../user.entity';

const userMock: Omit<IUser, 'password' | 'code'> = {
	id: '1',
	email: 'a@gmail.com',
	name: 'name',
	lastName: 'last name',
	phone: 'phone',
	photo: 'photo',
	level: 100,
	isActive: true,
	favorites: [],
	orders: [],
};

const changeProfileDtoMock: ChangeProfileDto & { password: string } = {
	phone: 'phone',
	lastName: 'lastName',
	password: '123',
};

describe('UserEntity', () => {
	let userEntity: UserEntity;

	beforeAll(() => {
		userEntity = new UserEntity(userMock);
	});

	it('getPublicProfile success', () => {
		const expectedResult = {
			id: userMock.id,
			email: userMock.email,
			name: userMock.name,
			lastName: userMock.lastName,
			phone: userMock.phone,
			photo: userMock.photo,
			level: userMock.level,
		};
		const result = userEntity.getPublicProfile();
		expect(result).toEqual(expectedResult);
	});

	it('getUpdateProfile success', () => {
		const expectedResult = {
			phone: changeProfileDtoMock.phone,
			lastName: changeProfileDtoMock.lastName,
		};
		const result = userEntity.getUpdateProfile(changeProfileDtoMock);
		expect(result).toEqual(expectedResult);
	});
});
