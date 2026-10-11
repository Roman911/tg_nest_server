import 'express-session';

import type { SessionMetadata } from './session-metadata.types.js';

declare module 'express-session' {
  interface SessionData {
		userId?: string;
		createdAt?: Date | string;
		metadata: SessionMetadata;
	}
}
