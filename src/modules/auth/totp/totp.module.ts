import { Module } from '@nestjs/common';
import { TotpService } from './totp.service.js';
import { TotpResolver } from './totp.resolver.js';

@Module({
  providers: [TotpResolver, TotpService],
})
export class TotpModule {}
