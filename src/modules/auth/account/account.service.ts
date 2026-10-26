import { ConflictException, Injectable } from '@nestjs/common';
import { hash } from 'argon2';

import { PrismaService } from '../../../core/prisma/prisma.service.js';
import { CreateUserInput } from './inputs/create-user.input.js';
import { VerificationService } from '../verification/verification.service.js';

@Injectable()
export class AccountService {
  public constructor(private readonly prismaService: PrismaService, private readonly verificationService: VerificationService) {}

  public async findAll() {
    return this.prismaService.user.findMany({
      omit: {
        password: true,
      },
    });
  }

	public async me(id: string) {
		return await this.prismaService.user.findUnique({
			where: {
				id
			}
		});
	}

  public async create(input: CreateUserInput) {
    const { username, email, password } = input;

		console.log(username, email, password);

    const [isUsernameExist, isEmailExist] = await Promise.all([
      this.prismaService.user.findUnique({
        where: { username },
      }),
      this.prismaService.user.findUnique({
        where: { email },
      }),
    ]);

    if (isUsernameExist) {
      throw new ConflictException('Username already exists');
    }

    if (isEmailExist) {
      throw new ConflictException('Email already exists');
    }

		const user = await this.prismaService.user.create({
			data: {
				username,
				email,
				password: await hash(password),
				displayName: username,
				// updated_up: new Date(),
			},
			// omit: {
			//   password: true,
			// },
		});

		await this.verificationService.sendVerificationToken(user);

		return true;
  }
}
