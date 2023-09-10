import {
	Body,
	Controller,
	Get,
	HttpCode,
	Post,
	Put,
	Query,
	Res,
	UseGuards,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { AuthService } from './auth.service';
import { ActivateDto } from './dto/activate.dto';
import { Cookies } from 'src/decorators/cookie';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/decorators/user';
import { IPayload } from './types/payload.interface';
import { GoogleApiClient } from './google.api.client';

@Controller('auth')
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly googleApiClient: GoogleApiClient,
	) {}

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

	@UseGuards(AuthGuard('jwt'))
	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Put('password')
	async changePassword(
		@Body() { oldPassword, newPassword }: ChangePasswordDto,
		@User() { email }: IPayload,
	) {
		const result = await this.authService.changePassword(email, oldPassword, newPassword);
		return result;
	}

	@Get('oauth')
	async googleAuth(@Query('code') code: string, @Res({ passthrough: true }) res: Response) {
		const { access_token } = await this.googleApiClient.getAccessToken(code);
		const googleUser = await this.googleApiClient.getGoogleUser(access_token);
		const { refreshToken, response } = await this.authService.googleAuth(googleUser);
		res.cookie('refreshToken', refreshToken);
		return response;
	}
}
