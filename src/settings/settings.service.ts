import axios from 'axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class SettingsService {
	constructor(private readonly configService: ConfigService) {}

	@Cron('* * * * *')
	async healthCheck() {
		const backendUrl = `${this.configService.get('BACKEND_HOST')}/api/settings/health-check`;
		const frontendUrl = this.configService.get('FRONTED_HOST');

		await axios.get(backendUrl);
		await axios.get(frontendUrl);
	}
}
