import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthRepository } from './repositories/auth.repository';
import { TokenModel } from './models/token.model';
import { TypegooseModule } from 'nestjs-typegoose';
import { UserModule } from '../user/user.module';
import { UserModel } from '../user/models/user.model';
import { AuthMailer } from './auth.mailer';
import { ConfigModule } from '@nestjs/config';
import { AuthService } from './auth.service';

@Module({
	imports: [
		TypegooseModule.forFeature([
			{
				typegooseClass: TokenModel,
				schemaOptions: {
					collection: 'Token',
				},
			},
			{
				typegooseClass: UserModel,
				schemaOptions: {
					collection: 'User',
				},
			},
		]),
		UserModule,
		ConfigModule,
	],
	controllers: [AuthController],
	providers: [AuthRepository, AuthMailer, AuthService],
})
export class AuthModule {}
