import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer/dist/mailer.service.js';
import { render } from 'react-email';

import { VerificationTemplate } from './templates/verefication.template.js';
import { PasswordRecoveryTemplate } from './templates/password-recovery.template.js';
import type { SessionMetadata } from '../../../shared/types/session-metadata.types.js';

@Injectable()
export class MailService {
	public constructor(
		private readonly mailService: MailerService,
		private readonly configService: ConfigService,
	) {}

	public async sendVerificationToken(email: string, token: string) {
		const domain = this.configService.getOrThrow<string>('ALLOWED_ORIGIN');
		const html = await render(VerificationTemplate({ domain, token }));

		return this.sendMail(email, 'Verification account', html);
	}

	public async sendPasswordResetToken(email: string, token: string, metadata: SessionMetadata) {
		const domain = this.configService.getOrThrow<string>('ALLOWED_ORIGIN');
		const html = await render(PasswordRecoveryTemplate({ domain, token, metadata }));

		return this.sendMail(email, 'Reset password', html);
	}

	private sendMail(mail: string, subject: string, html: string) {
		return this.mailService.sendMail({
			to: mail,
			subject,
			html
		})
	}
}
