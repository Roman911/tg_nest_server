import type { ConfigService } from '@nestjs/config';
import { ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';

import { isDev } from '../../shared/utils/is-dev.util.js';

interface GraphQLContext {
  req: Request;
  res: Response;
}

export function getGraphQLConfig(configService: ConfigService): ApolloDriverConfig {
  return {
    playground: isDev(configService),
    path: configService.getOrThrow<string>('GRAPHQL_PREFIX'),
    autoSchemaFile: join(process.cwd(), 'src/core/graphql/schema.gql'),
    sortSchema: true,
    context: ({ req, res }: GraphQLContext) => ({ req, res }),
  };
}
