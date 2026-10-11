export interface LocationIfo {
	country: string;
	city: string;
	latitude: number;
	longitude: number;
}

export interface DeviceIfo {
	browser: string;
	os: string;
	type: string;
}

export interface SessionMetadata {
	location: LocationIfo;
	devices: DeviceIfo;
	ip: string;
}
