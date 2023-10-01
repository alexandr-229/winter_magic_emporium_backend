import { Controller, HttpCode, Post } from '@nestjs/common';
import { SenderService } from 'src/sender/sender.service';

@Controller('payment')
export class PaymentController {
	constructor(private readonly senderService: SenderService) {}

	@HttpCode(200)
	@Post('pay')
	async pay() {
		await this.senderService.sendMessage();
		return { message: 'OK' };
	}
}
