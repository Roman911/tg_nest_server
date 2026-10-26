import { InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import type { Request } from 'express';

import type { User } from '../../generated/prisma/client.js';
import type { SessionMetadata } from '../types/session-metadata.types.js';

export function saveSession(req: Request, user: User, metadata: SessionMetadata) {
	req.session.createdAt = new Date();
	req.session.userId = user.id;
	req.session.metadata = metadata;

	return new Promise((resolve, reject) => {
		req.session.save((err) => {
			if (err) {
				reject(new InternalServerErrorException(err.message));
				return;
			}

			resolve(user);
		});
	});
}

export function destroySession(req: Request, configService: ConfigService) {
	return new Promise((resolve, reject) => {
		req.session.destroy((err) => {
			if (err) {
				return reject(new InternalServerErrorException(err.message));
			}

			req.res?.clearCookie(configService.getOrThrow<string>('SESSION_NAME'));

			resolve(true);
		});
	});
}
