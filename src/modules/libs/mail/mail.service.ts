import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer/dist/mailer.service.js';
import { render } from 'react-email';

import { VerificationTemplate } from './templates/verefication.template.js';

@Injectable()
export class MailService {
	public constructor(
		private readonly mailService: MailerService,
		private readonly configService: ConfigService,
	) {}

	public async sendVerificationToken(email: string, token: string) {
		const domain = this.configService.getOrThrow<string>('ALLOWED_ORIGIN');
		const html = await render(VerificationTemplate({domain, token}));

		return this.sendMail(email, 'Verification account', html);
	}

	private sendMail(mail: string, subject: string, html: string) {
		return this.mailService.sendMail({
			to: mail,
			subject,
			html
		})
	}
}
