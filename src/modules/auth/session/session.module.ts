import { Module } from '@nestjs/common';
import { SessionService } from './session.service.js';
import { SessionResolver } from './session.resolver.js';

@Module({
  providers: [SessionResolver, SessionService],
})
export class SessionModule {}
