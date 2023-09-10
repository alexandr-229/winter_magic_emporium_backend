import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { AuthRepository } from './repositories/auth.repository';
import { AuthEntity } from './auth.entity';
import { AuthMailer } from './auth.mailer';
import { TokenRepository } from './repositories/token.repository';
import { JwtService } from '@nestjs/jwt';
import { IPayload } from './types/payload.interface';

@Injectable()
export class AuthService {
	constructor(
		private readonly userRepository: AuthRepository,
		private readonly tokenRepository: TokenRepository,
		private readonly authMailer: AuthMailer,
		private readonly jwtService: JwtService,
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

		const payload: IPayload = { email: user.email, id: _id.toString() };
		const refreshToken = await this.jwtService.signAsync(payload, { expiresIn: '30d' });

		await this.tokenRepository.createToken(refreshToken, user.email);

		return { id: _id };
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

		const payload: IPayload = { id: user.id, email };
		const accessToken = await this.jwtService.signAsync(payload, { expiresIn: '30m' });

		const result = { accessToken, id: user.id };

		return result;
	}

	async login(email: string, password: string) {
		const user = await this.userRepository.getUserByEmail(email);
		if (!user) {
			throw new HttpException('User not found', HttpStatus.NOT_FOUND);
		}

		const userEntity = new AuthEntity(user);

		const passwordCorrect = await userEntity.comparePassword(password);

		if (!passwordCorrect) {
			throw new HttpException('Password incorrect', HttpStatus.UNAUTHORIZED);
		}

		const payload: IPayload = { id: user.id, email };
		const accessToken = await this.jwtService.signAsync(payload, { expiresIn: '30m' });

		const result = { accessToken, id: user.id };

		return result;
	}
}
