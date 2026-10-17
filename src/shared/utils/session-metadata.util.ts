import type { Request } from 'express';
import geoip from 'geoip-lite';
import { createRequire } from 'node:module';

import type { SessionMetadata } from '../types/session-metadata.types.js';
import { IS_DEV_ENV } from './is-dev.util.js';

import DeviceDetector = require('device-detector-js');

const require = createRequire(import.meta.url);

const countries = require('i18n-iso-countries');
const enLocale = require('i18n-iso-countries/langs/en.json');

countries.registerLocale(enLocale);

export function getSessionMetadata(req: Request, userAgent: string): SessionMetadata {
	const cfConnectingIp = req.headers['cf-connecting-ip'];
	const forwardedFor = req.headers['x-forwarded-for'];

	const ip = IS_DEV_ENV
		? '173.166.164.121'
		: (Array.isArray(cfConnectingIp) ? cfConnectingIp[0] : cfConnectingIp) ||
			(typeof forwardedFor === 'string' ? forwardedFor.split(',')[0]?.trim() : undefined) ||
			req.ip ||
			'';

	const location = ip ? geoip.lookup(ip) : null;
	const device = new DeviceDetector().parse(userAgent);

	return {
		location: {
			country: countries.getName(location?.country || '', 'en') || 'Невідомо',
			city: location?.city || '',
			latitude: location?.ll[0] ?? 0,
			longitude: location?.ll[1] ?? 0,
		},
		device: {
			browser: device.client?.name || '',
			os: device.os?.name || '',
			type: device.device?.type || '',
		},
		ip,
	};
}
