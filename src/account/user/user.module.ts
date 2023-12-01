import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { UserModel } from './models/user.model';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';

@Module({
	imports: [
		TypegooseModule.forFeature([
			{
				typegooseClass: UserModel,
				schemaOptions: {
					collection: 'User',
				},
			},
		]),
	],
	controllers: [UserController],
	providers: [UserRepository],
	exports: [UserRepository],
})
export class UserModule {}
