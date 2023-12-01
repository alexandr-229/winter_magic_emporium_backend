import { Controller, Get, HttpCode, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { SenderService } from 'src/sender/sender.service';
import { MESSAGE } from './payment.const';
import { PaymentService } from './payment.service';
import { User } from 'src/decorators/user';
import { IPayload } from 'src/account/auth/types/payload.interface';
import { AuthGuard } from '@nestjs/passport';

@Controller('payment')
export class PaymentController {
	constructor(
		private readonly senderService: SenderService,
		private readonly paymentService: PaymentService,
	) {}

	@UseGuards(AuthGuard('jwt'))
	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Get('pay')
	async pay(@User() { email }: IPayload) {
		await this.paymentService.addOrderToOrderHistory(email);
		await this.senderService.sendMessage(MESSAGE, email);
		return { message: 'OK' };
	}
}
