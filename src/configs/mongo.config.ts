import { TypegooseModuleAsyncOptions } from 'nestjs-typegoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

export const getMongoConfig = (): TypegooseModuleAsyncOptions => ({
	imports: [ConfigModule],
	inject: [ConfigService],
	useFactory: (configService: ConfigService) => ({
		uri: configService.get('MONGO_URI'),
		useUnifiedTopology: true,
	}),
});
