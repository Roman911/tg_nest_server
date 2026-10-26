import { Module } from '@nestjs/common';

import { AccountService } from './account.service.js';
import { AccountResolver } from './account.resolver.js';
import { VerificationService } from '../verification/verification.service.js';

@Module({
  providers: [AccountResolver, AccountService, VerificationService],
})
export class AccountModule {}
