import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { AccountService } from './account.service.js';
import { UserModel } from './models/user.model.js';
import { CreateUserInput } from './inputs/create-user.input.js';
import { Authorized } from '../../../shared/decorators/authorized.decorator.js';
import { Authorization } from '../../../shared/decorators/auth.decorator.js';

@Resolver('Account')
export class AccountResolver {
  public constructor(private readonly accountService: AccountService) {}

  @Query(() => [UserModel], { name: 'findAllUsers' })
  public async findAll() {
    return await this.accountService.findAll();
  }

	@Authorization()
	@Query(() => UserModel, { name: 'findProfile' })
	public async me(@Authorized('id') id: string) {
		return await this.accountService.me(id);
	}

  @Mutation(() => UserModel, { name: 'createUser' })
  public async create(@Args('data') input: CreateUserInput) {
    return await this.accountService.create(input);
  }
}
