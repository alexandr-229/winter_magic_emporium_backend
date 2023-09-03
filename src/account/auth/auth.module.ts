import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthRepository } from './repositories/auth.repository';
import { TokenModel } from './models/token.model';
import { TypegooseModule } from 'nestjs-typegoose';
import { UserModule } from '../user/user.module';
import { UserModel } from '../user/models/user.model';

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
	],
	controllers: [AuthController],
	providers: [AuthRepository],
})
export class AuthModule {}
