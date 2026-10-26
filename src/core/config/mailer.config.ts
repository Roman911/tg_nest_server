import type { MailerOptions } from '@nestjs-modules/mailer/dist/interfaces/mailer-options.interface';
import type { ConfigService } from '@nestjs/config';

export function getMailerConfig(configService: ConfigService): MailerOptions {
	return {
		transport: {
			host: configService.getOrThrow<string>('MAIL_HOST'),
			port: configService.getOrThrow<string>('MAIL_PORT'),
			secure: true,
			auth: {
				user: configService.getOrThrow<string>('MAIL_LOGIN'),
				pass: configService.getOrThrow<string>('MAIL_PASSWORD'),
			}
		},
		defaults: {
			from: `Travel guide ${configService.getOrThrow<string>('MAIL_LOGIN')}`,
		}
	};
}
