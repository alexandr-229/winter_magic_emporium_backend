import { ConfigModule, ConfigService } from '@nestjs/config';
import { ISenderModuleAsyncOptions } from 'src/sender/types/options';

export const getSenderOptions = (): ISenderModuleAsyncOptions => ({
	imports: [ConfigModule],
	inject: [ConfigService],
	useFactory: (configService: ConfigService) => {
		const botId = configService.get('TELEGRAM_BOT_ID');
		const chatId = configService.get('TELEGRAM_CHAT_ID');

		if (!botId) {
			throw new Error('You need to set TELEGRAM_BOT_ID');
		}

		if (!chatId) {
			throw new Error('You need to set TELEGRAM_CHAT_ID');
		}

		return {
			telegram: {
				botId,
				chatId,
			},
		};
	},
});
