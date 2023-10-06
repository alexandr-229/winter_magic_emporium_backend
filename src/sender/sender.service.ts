import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Transporter, createTransport } from 'nodemailer';
import Mail from 'nodemailer/lib/mailer/index.js';
import SMTPTransport from 'nodemailer/lib/smtp-transport/index.js';
import { getSMTPConfig } from 'src/configs/smtp.config';
import { Telegraf } from 'telegraf';
import { SENDER_MODULE_OPTIONS } from './sender.const';
import { ISenderOptions } from './types/options';

@Injectable()
export class SenderService {
	private readonly transporter: Transporter<SMTPTransport.SentMessageInfo>;
	private readonly bot: Telegraf;

	constructor(
		@Inject(SENDER_MODULE_OPTIONS) private readonly options: ISenderOptions,
		readonly configService: ConfigService,
	) {
		this.bot = new Telegraf(options.telegram.botId);
		this.transporter = createTransport(getSMTPConfig(configService));
	}

	async sendMessage(messageHTML: string, to: string) {
		try {
			const telegramMessage = `The message was sent to ${to}`;
			const options: Mail.Options = {
				from: this.configService.get('SMTP_USER'),
				to,
				subject: 'Winter Magic Emporium',
				text: '',
				html: messageHTML,
			};

			await this.transporter.sendMail(options);
			await this.bot.telegram.sendMessage(this.options.telegram.chatId, telegramMessage);
		} catch (e) {
			Logger.error('Failed to send message');
			Logger.error(e);
		}
	}
}
