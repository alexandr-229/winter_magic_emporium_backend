import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { ConfigModule } from '@nestjs/config';
import { getMongoConfig } from './configs/mongo.config';
import { AccountModule } from './account/account.module';
import { ProductsModule } from './products/products.module';
import { FilesModule } from './files/files.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath: `.env.${process.env.NODE_ENV}`,
		}),
		TypegooseModule.forRootAsync(getMongoConfig()),
		AccountModule,
		ProductsModule,
		FilesModule,
	],
})
export class AppModule {}
