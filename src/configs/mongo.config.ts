import { TypegooseModuleAsyncOptions } from 'nestjs-typegoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

export const getMongoConfig = (): TypegooseModuleAsyncOptions => ({
	imports: [ConfigModule],
	inject: [ConfigService],
	useFactory: (configService: ConfigService) => ({
		uri: getMongoUrl(configService),
		useUnifiedTopology: true,
	}),
});

const getMongoUrl = (configService: ConfigService) =>
	'mongodb://' +
	configService.get('MONGO_USERNAME') +
	':' +
	configService.get('MONGO_PASSWORD') +
	'@' +
	configService.get('MONGO_HOST') +
	':' +
	configService.get('MONGO_PORT') +
	'/' +
	configService.get('MONGO_DATABASE');
