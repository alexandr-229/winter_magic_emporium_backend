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
import { TokenRepository } from './repositories/token.repository';
import { JwtModule } from '@nestjs/jwt';
import { getJwtConfig } from 'src/configs/jwt.config';
import { TokenService } from './token.service';
import { JwtAuthStrategy } from './strategies/jwt.strategy';

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
		JwtModule.registerAsync(getJwtConfig()),
		UserModule,
		ConfigModule,
	],
	controllers: [AuthController],
	providers: [
		TokenRepository,
		AuthRepository,
		AuthMailer,
		AuthService,
		TokenService,
		JwtAuthStrategy,
	],
})
export class AuthModule {}
