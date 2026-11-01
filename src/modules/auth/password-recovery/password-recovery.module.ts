import { Module } from '@nestjs/common';
import { PasswordRecoveryService } from './password-recovery.service.js';
import { PasswordRecoveryResolver } from './password-recovery.resolver.js';

@Module({
  providers: [PasswordRecoveryResolver, PasswordRecoveryService],
})
export class PasswordRecoveryModule {}
