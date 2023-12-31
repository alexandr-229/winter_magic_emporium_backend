import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { AuthRepository } from './repositories/auth.repository';
import { AuthEntity } from './auth.entity';
import { AuthMailer } from './auth.mailer';
import { TokenRepository } from './repositories/token.repository';
import { TokenService } from './token.service';
import { IGoogleUser } from './types/google.user.interface';
import { IUser } from './types/user.interface';
import {
	INVALID_CODE,
	PASSWORD_INCORRECT,
	REFRESH_TOKEN_NOT_VALID,
	USER_ALREADY_EXISTS,
	USER_NOT_ACTIVATED,
	USER_NOT_FOUND,
} from './auth.const';

@Injectable()
export class AuthService {
	constructor(
		private readonly userRepository: AuthRepository,
		private readonly tokenRepository: TokenRepository,
		private readonly authMailer: AuthMailer,
		private readonly tokenService: TokenService,
	) {}

	private async rewriteRefreshToken(email: string, userId: string) {
		const refreshTokenData = await this.tokenRepository.getToken(email);
		const result = { refreshToken: '' };

		if (!refreshTokenData) {
			const token = await this.tokenService.generateToken(email, userId, '30d');
			await this.tokenRepository.createToken(token, email);
			result.refreshToken = token;
			return result;
		}

		const { refreshToken } = refreshTokenData.toJSON();
		const tokenValid = await this.tokenService.validateToken(refreshToken);
		result.refreshToken = refreshToken;

		if (!tokenValid) {
			const token = await this.tokenService.generateToken(email, userId, '30d');
			await this.tokenRepository.updateToken(email, token);
			result.refreshToken = token;
		}

		return result;
	}

	async register(dto: RegisterDto) {
		const existUser = await this.userRepository.getUserByEmail(dto.email);
		if (existUser) {
			throw new HttpException(USER_ALREADY_EXISTS, HttpStatus.BAD_REQUEST);
		}

		const user = new AuthEntity({ ...dto, code: 0, favorites: [] });
		user.setLevel();
		user.setCode();
		await user.setPassword(dto.password);

		await this.authMailer.sendCode(dto.email, user.code);

		const { _id } = await this.userRepository.createUser(user);

		const refreshToken = await this.tokenService.generateToken(
			user.email,
			_id.toString(),
			'30d',
		);

		await this.tokenRepository.createToken(refreshToken, user.email);

		return { id: _id, refreshToken };
	}

	async activate(email: string, code: number) {
		const user = await this.userRepository.getUserByEmail(email);
		if (!user) {
			throw new HttpException(USER_NOT_FOUND, HttpStatus.NOT_FOUND);
		}

		const userEntity = new AuthEntity(user);
		const codeValid = userEntity.compareCode(code);

		if (!codeValid) {
			throw new HttpException(INVALID_CODE, HttpStatus.FORBIDDEN);
		}

		await this.userRepository.updateUserByEmail(email, { isActive: true });

		const accessToken = await this.tokenService.generateToken(
			email,
			user._id.toString(),
			'30m',
		);

		const result = { accessToken, id: user._id.toString() };

		return result;
	}

	async login(email: string, password: string) {
		const user = await this.userRepository.getUserByEmail(email);
		if (!user) {
			throw new HttpException(USER_NOT_FOUND, HttpStatus.NOT_FOUND);
		}

		if (!user.isActive) {
			throw new HttpException(USER_NOT_ACTIVATED, HttpStatus.UNAUTHORIZED);
		}

		const userEntity = new AuthEntity(user);

		const passwordCorrect = await userEntity.comparePassword(password);

		if (!passwordCorrect) {
			throw new HttpException(PASSWORD_INCORRECT, HttpStatus.UNAUTHORIZED);
		}

		const accessToken = await this.tokenService.generateToken(
			email,
			user._id.toString(),
			'30m',
		);

		const { refreshToken } = await this.rewriteRefreshToken(email, user._id.toString());

		const result = {
			response: { accessToken, id: user._id.toString() },
			refreshToken,
		};

		return result;
	}

	async logout(token: string) {
		await this.tokenRepository.deleteToken(token);
	}

	async refresh(refreshToken: string) {
		const tokenValid = await this.tokenService.validateToken(refreshToken);
		if (!tokenValid) {
			await this.tokenRepository.deleteToken(refreshToken);
			throw new HttpException(REFRESH_TOKEN_NOT_VALID, HttpStatus.UNAUTHORIZED);
		}

		const { email, id } = this.tokenService.decodeToken(refreshToken);

		const accessToken = await this.tokenService.generateToken(email, id, '30m');

		const result = { accessToken, id };

		return result;
	}

	async changePassword(email: string, oldPassword: string, newPassword: string) {
		const user = await this.userRepository.getUserByEmail(email);
		if (!user) {
			throw new HttpException(USER_NOT_FOUND, HttpStatus.NOT_FOUND);
		}

		const userEntity = new AuthEntity(user);

		const passwordValid = await userEntity.comparePassword(oldPassword);
		if (!passwordValid) {
			throw new HttpException(PASSWORD_INCORRECT, HttpStatus.FORBIDDEN);
		}

		await userEntity.setPassword(newPassword);

		await this.userRepository.updateUserByEmail(email, userEntity);

		const result = { id: user._id.toString() };

		return result;
	}

	async googleAuth(user: IGoogleUser) {
		const existUser = await this.userRepository.getUserByEmail(user.email);

		const result = {
			response: { accessToken: '', id: '' },
			refreshToken: '',
		};

		if (existUser) {
			const { refreshToken } = await this.rewriteRefreshToken(
				user.email,
				existUser._id.toString(),
			);
			result.refreshToken = refreshToken;
			result.response.id = existUser._id.toString();
		} else {
			const defaultUser: Omit<IUser, 'level' | 'isActive'> = {
				email: user.email,
				password: '',
				name: user.name,
				lastName: '',
				phone: '',
				code: 0,
				favorites: [],
			};

			const userEntity = new AuthEntity(defaultUser);
			userEntity.setLevel();

			const { _id } = await this.userRepository.createUser(userEntity);

			const refreshToken = await this.tokenService.generateToken(
				user.email,
				_id.toString(),
				'30d',
			);

			await this.tokenRepository.createToken(refreshToken, user.email);

			result.refreshToken = refreshToken;
			result.response.id = _id.toString();
		}

		const accessToken = await this.tokenService.generateToken(
			user.email,
			result.response.id,
			'30m',
		);

		result.response.accessToken = accessToken;

		return result;
	}
}
