import { Injectable } from '@nestjs/common';
import { IPayload } from './types/payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenService {
	constructor(private readonly jwtService: JwtService) {}

	async generateToken(email: string, id: string, expiresIn: string) {
		const payload: IPayload = { email, id };
		const token = await this.jwtService.signAsync(payload, { expiresIn });
		return token;
	}

	async validateToken(token: string) {
		try {
			const result = await this.jwtService.verifyAsync(token);
			return !!result;
		} catch (e) {
			console.log('Error in AuthModule.TokenService.validateToken');
			console.log(e);
			return false;
		}
	}
}
