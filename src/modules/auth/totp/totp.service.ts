import { BadRequestException, Injectable } from '@nestjs/common';

import { encode } from 'hi-base32';
import { randomBytes } from 'node:crypto';
import { TOTP } from 'otpauth';
import * as QRCode from 'qrcode';

import { PrismaService } from '../../../core/prisma/prisma.service.js';
import type { User } from '../../../generated/prisma/client.js';
import { EnableTotpInput } from './inputs/enable-totp.input.js';

@Injectable()
export class TotpService {
	public constructor(private readonly prismaService: PrismaService) {}

	public async generate(user: User) {
		const secret = encode(randomBytes(15)).replace(/=/g, '').substring(0, 24);

		const totp = new TOTP({
			issuer: 'TravelGuide',
			label: `${user.email}`,
			algorithm: 'SHA1',
			digits: 6,
			secret
		});

		const totpAuthUrl = totp.toString();
		const qrcodeUrl = await QRCode.toDataURL(totpAuthUrl);

		return { qrcodeUrl, secret };
	}

	public async enable(user: User, input: EnableTotpInput) {
		const { secret, pin } = input;

		const totp = new TOTP({
			issuer: 'TravelGuide',
			label: `${user.email}`,
			algorithm: 'SHA1',
			digits: 6,
			secret
		});

		const delta = totp.validate({ token: pin });

		if(delta === null) {
			throw new BadRequestException('No valid pin');
		}

		await this.prismaService.user.update({
			where: {
				id: user.id
			},
			data: {
				isTotpEnabled: true,
				totpSecret: secret
			}
		});

		return true;
	}

	public async disable(user: User) {
		await this.prismaService.user.update({
			where: {
				id: user.id
			},
			data: {
				isTotpEnabled: false,
				totpSecret: null
			}
		});

		return true;
	}
}
