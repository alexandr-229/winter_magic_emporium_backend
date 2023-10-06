import { ConfigService } from '@nestjs/config';

export const getSMTPConfig = (configService: ConfigService) => {
	const result = {
		host: configService.get('SMTP_HOST'),
		port: configService.get('SMTP_PORT'),
		secure: true,
		auth: {
			user: configService.get('SMTP_USER'),
			pass: configService.get('SMTP_PASSWORD'),
		},
	};

	return result;
};
