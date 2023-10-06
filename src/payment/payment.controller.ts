import { Body, Controller, HttpCode, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { SenderService } from 'src/sender/sender.service';
import { PayDto } from './dto/pay.dto';
import { MESSAGE } from './payment.const';

@Controller('payment')
export class PaymentController {
	constructor(private readonly senderService: SenderService) {}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('pay')
	async pay(@Body() { email }: PayDto) {
		await this.senderService.sendMessage(MESSAGE, email);
		return { message: 'OK' };
	}
}
