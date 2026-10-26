import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import type { Request } from 'express';

import { PrismaService } from '../../../core/prisma/prisma.service.js';
import { MailService } from '../../libs/mail/mail.service.js';
import { VerificationInput } from './inputs/verification.input.js';
import { TokenType } from '../../../generated/prisma/enums.js';
import { getSessionMetadata } from '../../../shared/utils/session-metadata.util.js';
import { saveSession } from '../../../shared/utils/session.util.js';
import { User } from '../../../generated/prisma/client.js';
import { generateToken } from '../../../shared/utils/generate-token.util.js';

@Injectable()
export class VerificationService {
	public constructor(
		private readonly prismaService: PrismaService,
		private readonly mailService: MailService
	) {}

	public async verify(req: Request, input: VerificationInput, userAgent: string) {
		const { token } = input;

		const existingToken = await this.prismaService.token.findUnique({
			where: {
				token,
				type: TokenType.EMAIL_VERIFY,
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

		const user = await this.prismaService.user.update({
			where: {
				id: existingToken.userId
			},
			data: {
				isEmailVerified: true
			}
		});

		await this.prismaService.token.delete({
			where: {
				id: existingToken.id,
				type: TokenType.EMAIL_VERIFY,
			}
		});

		const metadata = getSessionMetadata(req, userAgent);

		return saveSession(req, user, metadata);
	}

	public async sendVerificationToken(user: User) {
		const verificationToken = await generateToken(
			this.prismaService,
			user,
			TokenType.EMAIL_VERIFY,
			true
		);

		await this.mailService.sendVerificationToken(user.email, verificationToken.token)

		return true;
	}
}
