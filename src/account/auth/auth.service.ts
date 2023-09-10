import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { AuthRepository } from './repositories/auth.repository';
import { AuthEntity } from './auth.entity';
import { AuthMailer } from './auth.mailer';
import { TokenRepository } from './repositories/token.repository';
import { TokenService } from './token.service';

@Injectable()
export class AuthService {
	constructor(
		private readonly userRepository: AuthRepository,
		private readonly tokenRepository: TokenRepository,
		private readonly authMailer: AuthMailer,
		private readonly tokenService: TokenService,
	) {}

	async register(dto: RegisterDto) {
		const existUser = await this.userRepository.getUserByEmail(dto.email);
		if (existUser) {
			throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
		}

		const user = new AuthEntity({ ...dto, code: 0 });
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
			throw new HttpException('User not found', HttpStatus.NOT_FOUND);
		}

		const userEntity = new AuthEntity(user);
		const codeValid = userEntity.compareCode(code);

		if (!codeValid) {
			throw new HttpException('Invalid code', HttpStatus.FORBIDDEN);
		}

		await this.userRepository.updateUserByEmail(email, { isActive: true });

		const accessToken = await this.tokenService.generateToken(
			email,
			user._id.toString(),
			'30m',
		);

		const result = { accessToken, id: user.id };

		return result;
	}

	async login(email: string, password: string) {
		const user = await this.userRepository.getUserByEmail(email);
		if (!user) {
			throw new HttpException('User not found', HttpStatus.NOT_FOUND);
		}

		if (!user.isActive) {
			throw new HttpException('User not activated', HttpStatus.UNAUTHORIZED);
		}

		const userEntity = new AuthEntity(user);

		const passwordCorrect = await userEntity.comparePassword(password);

		if (!passwordCorrect) {
			throw new HttpException('Password incorrect', HttpStatus.UNAUTHORIZED);
		}

		const accessToken = await this.tokenService.generateToken(
			email,
			user._id.toString(),
			'30m',
		);

		const result = {
			response: { accessToken, id: user.id },
			refreshToken: '',
		};

		const refreshTokenData = await this.tokenRepository.getToken(email);

		if (!refreshTokenData) {
			const token = await this.tokenService.generateToken(email, user._id.toString(), '30d');
			await this.tokenRepository.createToken(token, email);
			result.refreshToken = token;
			return result;
		}

		const { refreshToken } = refreshTokenData.toJSON();
		const tokenValid = await this.tokenService.validateToken(refreshToken);
		result.refreshToken = refreshToken;

		if (!tokenValid) {
			const token = await this.tokenService.generateToken(email, user._id.toString(), '30d');
			await this.tokenRepository.updateToken(email, token);
			result.refreshToken = token;
		}

		return result;
	}

	async logout(token: string) {
		await this.tokenRepository.deleteToken(token);
	}

	async refresh(refreshToken: string) {
		const tokenValid = await this.tokenService.validateToken(refreshToken);
		if (!tokenValid) {
			await this.tokenRepository.deleteToken(refreshToken);
			throw new HttpException('Refresh token is not valid', HttpStatus.UNAUTHORIZED);
		}

		const { email, id } = this.tokenService.decodeToken(refreshToken);

		const accessToken = await this.tokenService.generateToken(email, id, '30m');

		const result = { accessToken, id };

		return result;
	}
}
