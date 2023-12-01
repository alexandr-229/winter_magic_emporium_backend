import axios from 'axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class SettingsService {
	constructor(private readonly configService: ConfigService) {}

	@Cron('* * * * *')
	async healthCheck() {
		const url = `${this.configService.get('BACKEND_HOST')}/api/settings/health-check`;
		console.log(url);
		await axios.get(url);
	}
}
