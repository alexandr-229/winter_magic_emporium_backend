import { Injectable } from '@nestjs/common';

@Injectable()
export class SenderService {
	async sendMessage() {
		console.log('The message was sent successfully');
	}
}
