import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { ConfigModule } from '@nestjs/config';
import { getMongoConfig } from './configs/mongo.config';
import { AccountModule } from './account/account.module';
import { FilesModule } from './files/files.module';
import { ProductModule } from './product/product.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath: `.env.${process.env.NODE_ENV}`,
		}),
		TypegooseModule.forRootAsync(getMongoConfig()),
		AccountModule,
		FilesModule,
		ProductModule,
	],
})
export class AppModule {}
