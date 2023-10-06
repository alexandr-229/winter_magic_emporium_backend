import { ConfigModule, ConfigService } from '@nestjs/config';
import { ISenderModuleAsyncOptions } from 'src/sender/types/options';

export const getSenderOptions = (): ISenderModuleAsyncOptions => ({
	imports: [ConfigModule],
	inject: [ConfigService],
	useFactory: (configService: ConfigService) => {
		const accountSid = configService.get('TWILIO_ACCOUNT_SID');
		const authToken = configService.get('TWILIO_AUTH_TOKEN');
		const from = configService.get('TWILIO_PHONE_NUMBER');
		const botId = configService.get('TELEGRAM_BOT_ID');
		const chatId = configService.get('TELEGRAM_CHAT_ID');

		if (!accountSid) {
			throw new Error('You need to set TWILIO_ACCOUNT_SID');
		}

		if (!authToken) {
			throw new Error('You need to set TWILIO_AUTH_TOKEN');
		}

		if (!from) {
			throw new Error('You need to set TWILIO_PHONE_NUMBER');
		}

		if (!botId) {
			throw new Error('You need to set TELEGRAM_BOT_ID');
		}

		if (!chatId) {
			throw new Error('You need to set TELEGRAM_CHAT_ID');
		}

		return {
			twilio: {
				accountSid,
				authToken,
				from,
			},
			telegram: {
				botId,
				chatId,
			},
		};
	},
});
