import * as React from 'react';
import { Body, Head, Heading, Html, Link, Preview, Section, Tailwind, Text } from 'react-email';

interface VerificationTemplateProps {
	domain: string;
	token: string;
}

export function VerificationTemplate({ domain, token }: VerificationTemplateProps) {
	const verificationLink = `${domain}/account/verify?token=${token}`;

	return (
		<Html>
			<Head />
			<Preview>Verification account</Preview>
			<Tailwind>
				<Body className='max-w-2xl mx-auto p-6 bg-slate-50'>
					<Section className='text-center mb-8'>
						<Heading>Hello world</Heading>
						<Text>Hello</Text>
						<Link href={verificationLink}>email</Link>
					</Section>
				</Body>
			</Tailwind>
		</Html>
	);
}
