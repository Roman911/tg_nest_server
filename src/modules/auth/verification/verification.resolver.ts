import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';

import { VerificationService } from './verification.service.js';
import type { GqlContext } from '../../../shared/types/gql-context.types.js';
import { VerificationInput } from './inputs/verification.input.js';
import { UserAgent } from '../../../shared/decorators/user-agent.decorator.js';
import { UserModel } from '../account/models/user.model.js';

@Resolver('Verification')
export class VerificationResolver {
  public constructor(private readonly verificationService: VerificationService) {}

	@Mutation(() => UserModel, { name: 'verifyAccount' })
	public async verify(
		@Context() { req }: GqlContext,
		@Args('data') input: VerificationInput,
		@UserAgent() userAgent: string
	) {
		return this.verificationService.verify(req, input, userAgent);
	}
}
