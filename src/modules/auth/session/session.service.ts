import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { verify } from 'argon2';
import type { Request } from 'express';

import { PrismaService } from '../../../core/prisma/prisma.service.js';
import { LoginInput } from './inputs/login.input.js';
import { getSessionMetadata } from '../../../shared/utils/session-metadata.util.js';
import { RedisService } from '../../../core/redis/redis.service.js';
import { destroySession, saveSession } from '../../../shared/utils/session.util.js';
import { VerificationService } from '../verification/verification.service.js';

@Injectable()
export class SessionService {
  public constructor(
		private readonly prismaService: PrismaService,
		private readonly redisService: RedisService,
		private readonly configService: ConfigService,
		private readonly verificationService: VerificationService,
	) {}

	public async findByUser(req: Request,) {
		const userId = req.session.userId;

		if(!userId) {
			throw new NotFoundException('No user found.');
		}

		const keys = await this.redisService.client.keys('*');

		const userSessions = [];

		for (const key of keys) {
			const sessionsData = await this.redisService.client.get(key);

			if(sessionsData) {
				const session = JSON.parse(sessionsData);

				if(session.userId === userId) {
					userSessions.push({...session, id: key.split(':')[1]});
				}
			}
		}

		userSessions.sort((a, b) => b.createdAt - a.createdAt);

		return userSessions.filter(session => session.id === req.session.id);
	}

	public async findCurrent(req: Request) {
		const sessionId = req.session.id;

		const sessionData = await this.redisService.client.get(
			`${this.configService.getOrThrow<string>('SESSION_FOLDER')}${sessionId}`
		);

		const session = JSON.parse(sessionData || '');

		return {
			...session,
			id: sessionId,
		};
	}

  public async login(req: Request, input: LoginInput, userAgent: string) {
    const { login, password } = input;

    const user = await this.prismaService.user.findFirst({
      where: {
        OR: [{ username: { equals: login } }, { email: { equals: login } }],
      },
    });

    if(!user) {
      throw new NotFoundException('Invalid login');
    }

    const isValidPassword = await verify(user.password, password);

    if(!isValidPassword) {
      throw new NotFoundException('Invalid login');
    }

		if(!user.isEmailVerified) {
			await this.verificationService.sendVerificationToken(user);

			throw new BadRequestException('Invalid verification token');
		}

		const metadata = getSessionMetadata(req, userAgent);

		return saveSession(req, user, metadata);
  }

  public async logout(req: Request) {
		return destroySession(req, this.configService);
	}

	public async clearSession(req: Request) {
		req.res?.clearCookie(this.configService.getOrThrow<string>('SESSION_NAME'));

		return true;
	}

	public async remove(req: Request, id: string) {
		if(req.session.id === id) {
			throw new ConflictException('Invalid session');
		}

		await this.redisService.client.del(
			`${this.configService.getOrThrow<string>('SESSION_FOLDER')}${id}`
		);

		return true;
	}
}
