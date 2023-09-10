import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { IGoogleTokenData } from './types/google.token.data.interface';
import { IGoogleUser } from './types/google.user.interface';

@Injectable()
export class GoogleApiClient {
	constructor(private readonly configService: ConfigService) {}

	async getAccessToken(code: string) {
		try {
			const url = 'https://oauth2.googleapis.com/token';
			const requestConfig = {
				params: {
					client_id: this.configService.get('GOOGLE_CLIENT_ID'),
					redirect_uri: this.configService.get('GOOGLE_REDIRECT_URL'),
					client_secret: this.configService.get('GOOGLE_SECRET_ID'),
					grant_type: 'authorization_code',
					code,
				},
				headers: {
					Accept: 'application/json',
				},
			};
			const { data } = await axios.post<IGoogleTokenData>(url, {}, requestConfig);
			return data;
		} catch (e) {
			console.log('Error in AuthModule.GoogleApiClient.getAccessToken');
			console.log(e);
		}
	}

	async getGoogleUser(accessToken: string) {
		try {
			const config = {
				headers: {
					Accept: 'application/json',
					Authorization: `Bearer ${accessToken}`,
				},
			};
			const url = 'https://www.googleapis.com/oauth2/v3/userinfo';

			const { data } = await axios.get<IGoogleUser>(url, config);

			return data;
		} catch (e) {
			console.log('Error in AuthModule.GoogleApiClient.getGoogleUser');
			console.log(e);
		}
	}
}
