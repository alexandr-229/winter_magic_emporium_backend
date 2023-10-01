import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { ConfigModule } from '@nestjs/config';
import { getMongoConfig } from './configs/mongo.config';
import { AccountModule } from './account/account.module';
import { FilesModule } from './files/files.module';
import { ProductModule } from './product/product.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CartModule } from './cart/cart.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath: `.env.${process.env.NODE_ENV}`,
		}),
		TypegooseModule.forRootAsync(getMongoConfig()),
		ScheduleModule.forRoot(),
		AccountModule,
		FilesModule,
		ProductModule,
		CartModule,
	],
})
export class AppModule {}
