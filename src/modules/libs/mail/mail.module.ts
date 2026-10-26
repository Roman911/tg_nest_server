import { ConfigModule, ConfigService } from '@nestjs/config';
import { Global, Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer/dist/mailer.module.js';

import { MailService } from './mail.service.js';
import { getMailerConfig } from '../../../core/config/mailer.config.js';

@Global()
@Module({
	imports: [
		MailerModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: getMailerConfig,
			inject: [ConfigService]
		})
	],
  providers: [MailService],
	exports: [MailService]
})
export class MailModule {}
