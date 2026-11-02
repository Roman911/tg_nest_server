import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { TotpService } from './totp.service.js';
import { Authorized } from '../../../shared/decorators/authorized.decorator.js';
import type { User } from '../../../generated/prisma/client.js';
import { TotpModel } from './models/totp.model.js';
import { Authorization } from '../../../shared/decorators/auth.decorator.js';
import { EnableTotpInput } from './inputs/enable-totp.input.js';

@Resolver('Totp')
export class TotpResolver {
  public constructor(private readonly totpService: TotpService) {}

	@Authorization()
	@Query(() => TotpModel, { name: 'generateTotpSecret' })
	public async generate(@Authorized() user: User) {
		return this.totpService.generate(user);
	}

	@Authorization()
	@Mutation(() => Boolean, { name: 'enableTotp' })
	public async enable(@Authorized() user: User, @Args('data') input: EnableTotpInput) {
		return this.totpService.enable(user, input);
	}

	@Authorization()
	@Mutation(() => Boolean, { name: 'disableTotp' })
	public async disable(@Authorized() user: User) {
		return this.totpService.disable(user);
	}
}
