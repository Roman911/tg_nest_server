import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';

import type { GqlContext } from '../../../shared/types/gql-context.types.js';

import { SessionService } from './session.service.js';
import { UserModel } from '../account/models/user.model.js';
import { LoginInput } from './inputs/login.input.js';
import { UserAgent } from '../../../shared/decorators/user-agent.decorator.js';

@Resolver('Session')
export class SessionResolver {
  public constructor(private readonly sessionService: SessionService) {}

	@Mutation(() => UserModel, { name: 'loginUser' })
	public async login(@Context() { req }: GqlContext, @Args('data') input: LoginInput, @UserAgent() userAgent: string) {
		return this.sessionService.login(req, input, userAgent);
	}

	@Mutation(() => UserModel, { name: 'logoutUser' })
	public async logout(@Context() { req }: GqlContext) {
		return this.sessionService.logout(req);
	}
}
