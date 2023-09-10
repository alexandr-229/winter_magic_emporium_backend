import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { IPayload } from '../types/payload.interface';

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy) {
	constructor(readonly configService: ConfigService) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: configService.get('JWT_SECRET'),
		});
	}

	validate(payload: IPayload) {
		return payload;
	}
}
