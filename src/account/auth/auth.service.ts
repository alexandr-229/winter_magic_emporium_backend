import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { AuthRepository } from './repositories/auth.repository';
import { AuthEntity } from './auth.entity';
import { AuthMailer } from './auth.mailer';
import { TokenRepository } from './repositories/token.repository';
import { JwtService } from '@nestjs/jwt';

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

		const user = new AuthEntity(dto);
		user.setLevel();
		user.setCode();
		await user.setPassword(dto.password);

		const payload = { email: user.email };
		const refreshToken = await this.jwtService.signAsync(payload, { expiresIn: '30d' });

		await this.tokenRepository.createToken(refreshToken, user.email);

		await this.authMailer.sendCode(dto.email, user.code);

		const { _id } = await this.userRepository.createUser(user);

		return { id: _id };
	}
}
