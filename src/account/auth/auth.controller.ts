import {
	Body,
	Controller,
	Get,
	HttpCode,
	Post,
	Put,
	Res,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { AuthService } from './auth.service';
import { ActivateDto } from './dto/activate.dto';
import { Cookies } from 'src/decorators/cookie';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@UsePipes(new ValidationPipe())
	@Post('register')
	async register(@Body() dto: RegisterDto, @Res({ passthrough: true }) response: Response) {
		const { id, refreshToken } = await this.authService.register(dto);
		response.cookie('refreshToken', refreshToken, { httpOnly: true });
		return { id };
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
	async login(
		@Body() { email, password }: LoginDto,
		@Res({ passthrough: true }) response: Response,
	) {
		const result = await this.authService.login(email, password);
		response.cookie('refreshToken', result.refreshToken);
		return result.response;
	}

	@HttpCode(200)
	@Post('logout')
	async logout(
		@Cookies('refreshToken') token: string,
		@Res({ passthrough: true }) response: Response,
	) {
		await this.authService.logout(token);
		response.clearCookie('refreshToken');
		return { message: 'OK' };
	}

	@HttpCode(200)
	@Post('refresh')
	async refresh(@Cookies('refreshToken') token: string) {
		const result = await this.authService.refresh(token);
		return result;
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Put('password')
	async changePassword(@Body() { email, oldPassword, newPassword }: ChangePasswordDto) {
		const result = await this.authService.changePassword(email, oldPassword, newPassword);
		return result;
	}

	@Get('oauth')
	async googleAuth() {}
}
