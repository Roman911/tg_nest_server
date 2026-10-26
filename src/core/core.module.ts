import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver } from '@nestjs/apollo';

import { PrismaModule } from './prisma/prisma.module.js';
import { IS_DEV_ENV } from '../shared/utils/is-dev.util.js';
import { getGraphQLConfig } from './config/graphql.config.js';
import { RedisModule } from './redis/redis.module.js';
import { AccountModule } from '../modules/auth/account/account.module.js';
import { SessionModule } from '../modules/auth/session/session.module.js';
import { VerificationModule } from '../modules/auth/verification/verification.module.js';
import { MailModule } from '../modules/libs/mail/mail.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: !IS_DEV_ENV,
      isGlobal: true,
    }),
    GraphQLModule.forRootAsync({
      driver: ApolloDriver,
      imports: [ConfigModule],
      useFactory: getGraphQLConfig,
      inject: [ConfigService],
    }),
    PrismaModule,
    RedisModule,
		MailModule,
    AccountModule,
    SessionModule,
		VerificationModule
  ],
})
export class CoreModule {}
