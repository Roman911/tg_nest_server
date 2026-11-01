import * as React from 'react';
import { Body, Head, Heading, Html, Link, Preview, Section, Tailwind, Text } from 'react-email';

import type { SessionMetadata } from '../../../../shared/types/session-metadata.types.js';

interface PasswordRecoveryTemplateProps {
	domain: string;
	token: string;
	metadata: SessionMetadata;
}

export function PasswordRecoveryTemplate({
	domain,
	token,
	metadata,
}: PasswordRecoveryTemplateProps) {
	const resetLink = `${domain}/account/recovery/${token}`;
	return (
		<Html>
			<Head />
			<Preview>Verification account</Preview>
			<Tailwind>
				<Body className='max-w-2xl mx-auto p-6 bg-slate-50'>
					<Section className='bg-gray-100 rounded-lg p-6 mb-6'>
						<Heading className='text-xl font-semibold text-red-400'>Inform</Heading>
						<ul className='list-disc mt-2'>
							<li>
								location: {metadata.location.country}, {metadata.location.city}
							</li>
							<li>
								os: { metadata.device.os }
							</li>
							<li>
								browser: {metadata.device.browser}
							</li>
							<li>
								ip: {metadata.ip}
							</li>
						</ul>
					</Section>
					<Section className='text-center mb-8'>
						<Heading>Hello world</Heading>
						<Text>Hello</Text>
						<Link href={resetLink}>reset</Link>
					</Section>
				</Body>
			</Tailwind>
		</Html>
	);
}
