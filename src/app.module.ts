import { SettingsModule } from './settings/settings.module';
import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { ConfigModule } from '@nestjs/config';
import { getMongoConfig } from './configs/mongo.config';
import { AccountModule } from './account/account.module';
import { FilesModule } from './files/files.module';
import { ProductModule } from './product/product.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CartModule } from './cart/cart.module';
import { PaymentModule } from './payment/payment.module';
import { getSenderOptions } from './configs/sender.config';
import { SenderModule } from './sender/sender.module';

@Module({
	imports: [
		SettingsModule,
		ConfigModule.forRoot({
			envFilePath: `.env.${process.env.NODE_ENV}`,
		}),
		TypegooseModule.forRootAsync(getMongoConfig()),
		SenderModule.forRootAsync(getSenderOptions()),
		ScheduleModule.forRoot(),
		AccountModule,
		FilesModule,
		ProductModule,
		CartModule,
		PaymentModule,
	],
})
export class AppModule {}
