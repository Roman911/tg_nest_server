import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { verify } from 'argon2';
import type { Request } from 'express';

import { PrismaService } from '../../../core/prisma/prisma.service.js';
import { LoginInput } from './inputs/login.input.js';
import { ConfigService } from '@nestjs/config';
import { getSessionMetadata } from '../../../shared/utils/session-metadata.util.js';

@Injectable()
export class SessionService {
  public constructor(private readonly prismaService: PrismaService, private readonly configService: ConfigService) {}

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

    if (!isValidPassword) {
      throw new NotFoundException('Invalid login');
    }

		const metadata = getSessionMetadata(req, userAgent);

		req.session.createdAt = new Date();
		req.session.userId = user.id;
		req.session.metadata = metadata;

		await new Promise<void>((resolve, reject) => {
			req.session.save((err) => {
				if (err) {
					reject(new InternalServerErrorException(err.message));
					return;
				}

				resolve();
			});
		});

		return user;
  }

  public async logout(req: Request) {
		return new Promise((resolve, reject) => {
			req.session.destroy((err) => {
				if(err) {
					return reject(
						new InternalServerErrorException(err.message)
					);
				}

				req.res?.clearCookie(this.configService.getOrThrow<string>('SESSION_NAME'));
				resolve({ id: '123' });
			})
		});
	}
}
