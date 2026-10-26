import { Module } from '@nestjs/common';

import { SessionService } from './session.service.js';
import { SessionResolver } from './session.resolver.js';
import { VerificationService } from '../verification/verification.service.js';

@Module({
  providers: [SessionResolver, SessionService, VerificationService],
})
export class SessionModule {}
