import { Field, ID, ObjectType } from '@nestjs/graphql';

import type { User } from '../../../../generated/prisma/client.js';

@ObjectType()
export class UserModel implements User {
  @Field(() => ID)
  public id: string;

  @Field(() => String)
  public email: string;

  @Field(() => String)
  public password: string;

  @Field(() => String)
  public username: string;

  @Field(() => String)
  public display_name: string;

  @Field(() => String, { nullable: true })
  public avatar: string;

  @Field(() => String, { nullable: true })
  public age: string;

  @Field(() => Date)
  public created_at: Date;

  @Field(() => Date)
  public updated_up: Date;
}
