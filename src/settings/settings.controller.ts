import { Controller, Get } from '@nestjs/common';

@Controller('settings')
export class SettingsController {
	@Get('health-check')
	async healthCheck() {
		return { message: 'OK' };
	}
}
