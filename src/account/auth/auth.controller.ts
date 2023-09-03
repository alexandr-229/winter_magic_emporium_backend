import {
	Body,
	Controller,
	Get,
	HttpCode,
	Post,
	Put,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ChnagePasswordDto } from './dto/chnage-password.dto';

@Controller('auth')
export class AuthController {
	@UsePipes(new ValidationPipe())
	@Post('register')
	async register(@Body() dto: RegisterDto) {
		return dto;
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('login')
	async login(@Body() dto: LoginDto) {}

	@HttpCode(200)
	@Post('logout')
	async logout() {}

	@HttpCode(200)
	@Post('refresh')
	async refresh() {}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Put('password')
	async changePassword(@Body() dto: ChnagePasswordDto) {}

	@Get('oauth')
	async googleAuth() {}
}
