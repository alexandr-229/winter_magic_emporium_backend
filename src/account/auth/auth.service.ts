import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { AuthRepository } from './repositories/auth.repository';
import { AuthEntity } from './auth.entity';
import { AuthMailer } from './auth.mailer';

@Injectable()
export class AuthService {
	constructor(
		private readonly userRepository: AuthRepository,
		private readonly authMailer: AuthMailer,
	) {}

	async register(dto: RegisterDto) {
		const existUser = await this.userRepository.getUserByEmail(dto.email);
		if (existUser) {
			throw new HttpException('User alerady exists', HttpStatus.BAD_REQUEST);
		}

		const user = new AuthEntity(dto);
		user.setLevel();
		user.setCode();
		await user.setPassword(dto.password);

		await this.authMailer.sendCode(dto.email, user.code);

		const { _id } = await this.userRepository.createUser(user);

		return { id: _id };
	}
}
