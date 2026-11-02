import { Field, ObjectType } from '@nestjs/graphql';

import { UserModel } from './user.model.js';

@ObjectType()
export class AuthModel {
	@Field(() => UserModel, { nullable: true })
	public user: UserModel

	@Field(() => String, { nullable: true })
	public message: string
}
