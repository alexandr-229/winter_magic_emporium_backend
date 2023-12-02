import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
	process.env.NODE_OPTIONS = '--max-old-space-size=8192';

	const app = await NestFactory.create(AppModule, {
		cors: { origin: 'https://quiet-cucurucho-df3fdc.netlify.app', credentials: true },
	});
	app.use(cookieParser());
	app.setGlobalPrefix('api');
	await app.listen(3001);
}
bootstrap();
