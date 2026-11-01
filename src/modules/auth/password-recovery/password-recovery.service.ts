import { BadRequestException, Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import type { Request } from 'express';
import { hash } from 'argon2';

import { PrismaService } from '../../../core/prisma/prisma.service.js';
import { MailService } from '../../libs/mail/mail.service.js';
import { ResetPasswordInput } from './inputs/reset-password.input.js';
import { generateToken } from '../../../shared/utils/generate-token.util.js';
import { TokenType } from '../../../generated/prisma/enums.js';
import { getSessionMetadata } from '../../../shared/utils/session-metadata.util.js';
import { NewPasswordInput } from './inputs/new-password.input.js';

@Injectable()
export class PasswordRecoveryService {
	public constructor(
		private readonly prismaService: PrismaService,
		public readonly mailService: MailService,
	) {}

	public async resetPassword(req: Request, input: ResetPasswordInput, userAgent: string) {
		const { email } = input;

		const user = await this.prismaService.user.findUnique({
			where: { email },
		});

		if(!user) {
			throw new NotAcceptableException('User already exists');
		}

		const resetToken = await generateToken(
			this.prismaService,
			user,
			TokenType.PASSWORD_RESET
		);

		const metadata = getSessionMetadata(req, userAgent);

		await this.mailService.sendPasswordResetToken(user.email, resetToken.token, metadata);

		return true;
	}

	public async newPassword(input: NewPasswordInput) {
		const { password, token } = input;

		const existingToken = await this.prismaService.token.findUnique({
			where: {
				token,
				type: TokenType.PASSWORD_RESET,
			},
		});

		if(!existingToken) {
			throw new NotFoundException('Token not found');
		}

		const hasExpired = new Date(existingToken.expiresIn) < new Date();

		if(hasExpired) {
			throw new BadRequestException('Token expired');
		}

		if(!existingToken.userId) {
			throw new BadRequestException('Token is not associated with a user');
		}

		await this.prismaService.user.update({
			where: {
				id: existingToken.userId
			},
			data: {
				password: await hash(password),
			}
		});

		await this.prismaService.token.delete({
			where: {
				id: existingToken.id,
				type: TokenType.PASSWORD_RESET,
			}
		});

		return true;
	}
}
