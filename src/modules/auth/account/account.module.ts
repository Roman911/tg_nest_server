import { Module } from '@nestjs/common';
import { AccountService } from './account.service.js';
import { AccountResolver } from './account.resolver.js';

@Module({
  providers: [AccountResolver, AccountService],
})
export class AccountModule {}
