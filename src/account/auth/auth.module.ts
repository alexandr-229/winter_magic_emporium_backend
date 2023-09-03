import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthEntity } from './auth.entity';
import { AuthRepository } from './auth.repository';

@Module({
	controllers: [AuthController],
	providers: [AuthEntity, AuthRepository],
})
export class AuthModule {}
