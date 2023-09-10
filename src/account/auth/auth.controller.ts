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
import { ChangePasswordDto } from './dto/change-password.dto';
import { AuthService } from './auth.service';
import { ActivateDto } from './dto/activate.dto';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@UsePipes(new ValidationPipe())
	@Post('register')
	async register(@Body() dto: RegisterDto) {
		const result = await this.authService.register(dto);
		return result;
	}

	@UsePipes(new ValidationPipe())
	@Post('activate')
	async activate(@Body() { email, code }: ActivateDto) {
		const result = await this.authService.activate(email, code);
		return result;
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
	async changePassword(@Body() dto: ChangePasswordDto) {}

	@Get('oauth')
	async googleAuth() {}
}
