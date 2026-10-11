import { applyDecorators, UseGuards } from '@nestjs/common';

import { GqlAuthGuard } from '../guards/gql-auth.guard.js';

export function Authorization() {
	return applyDecorators(UseGuards(GqlAuthGuard));
}
