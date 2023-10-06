import { Injectable } from '@nestjs/common';
import { Transporter, createTransport } from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import Mail from 'nodemailer/lib/mailer/index.js';
import SMTPTransport from 'nodemailer/lib/smtp-transport/index.js';
import { getSMTPConfig } from '../../configs/smtp.config';

@Injectable()
export class AuthMailer {
	private readonly transporter: Transporter<SMTPTransport.SentMessageInfo>;

	constructor(private readonly configService: ConfigService) {
		this.transporter = createTransport(getSMTPConfig(configService));
	}

	async sendCode(email: string, code: number) {
		try {
			const options: Mail.Options = {
				from: this.configService.get('SMTP_USER'),
				to: email,
				subject: 'Activation code',
				text: '',
				html: `
                    <div>
                        <h1>Activation code</h1>
                        <p>Your code: ${code}</p>
                    </div>
                `,
			};

			this.transporter.sendMail(options);
		} catch (e) {
			console.log(e);
		}
	}
}
