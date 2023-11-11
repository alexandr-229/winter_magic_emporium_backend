import { Injectable, Logger } from '@nestjs/common';
import { TokenService } from './token.service';

@Injectable()
export class SharableService {
	constructor(private readonly tokenService: TokenService) {}

	getUserByToken(token: string) {
		try {
			const payload = this.tokenService.decodeToken(token);

			return payload;
		} catch (e) {
			Logger.error(e);
			return null;
		}
	}
}
