import { Module } from '@nestjs/common';
import { VerificationService } from './verification.service.js';
import { VerificationResolver } from './verification.resolver.js';

@Module({
  providers: [VerificationResolver, VerificationService],
})
export class VerificationModule {}
