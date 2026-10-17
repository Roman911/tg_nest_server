import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, type RedisClientType } from 'redis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
	public readonly client: RedisClientType;

	public constructor(private readonly configService: ConfigService) {
		this.client = createClient({
			url: configService.getOrThrow<string>('REDIS_URI'),
		});

		this.client.on('error', (error) => {
			console.error('Redis error:', error);
		});
	}

	public async onModuleInit() {
		await this.client.connect();
	}

	public async onModuleDestroy() {
		await this.client.quit();
	}

	public getClient() {
		return this.client;
	}
}
