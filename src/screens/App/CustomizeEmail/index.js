import styled from '@emotion/styled/macro';
import React from 'react';

import CustomEmailSidebar from '../../../components/CustomEmailSidebar';
import EmailCustomizer from '../../../components/EmailCustomizer';
import {FlexRow} from '../../../utils/content';
import {
	Container,
	Content,
	Heading,
	HeadingRow,
	Main,
} from '../../../utils/new/design-system';

const EmailContainer = styled('div')`
	flex: 1;
	max-width: 1200px;
	margin: 3.5rem auto;
`;

const CustomizeEmail = () => {
	const emailCategories = [
		{
			name: 'CUSTOMER',
			types: [
				{
					label: 'DELAY',
				},
				{
					label: 'FIRST',
				},
				{
					label: 'SECOND',
				},
				{
					label: 'LAST',
				},
			],
		},
		{
			name: 'CUSTOMER_REPORT',
			types: [
				{
					label: '',
				},
			],
		},
		{
			name: 'CONTENT_ACQUISITION',
			types: [
				{
					label: 'DELAY',
				},
				{
					label: 'FIRST',
				},
				{
					label: 'SECOND',
				},
				{
					label: 'LAST',
				},
			],
		},
		{
			name: 'INVOICE',
			types: [
				{
					label: 'INVOICE_DELAY',
				},
				{
					label: 'INVOICE_FIRST',
				},
				{
					label: 'INVOICE_SECOND',
				},
				{
					label: 'INVOICE_THIRD',
				},
				{
					label: 'INVOICE_FOURTH',
				},
				{
					label: 'INVOICE_LAST',
				},
			],
		},
	];

	return (
		<Container>
			<Main>
				<EmailContainer>
					<HeadingRow>
						<Heading>
							<fbt project="inyo" desc="emails">
								Modèles d'emails
							</fbt>
						</Heading>
					</HeadingRow>
					<FlexRow>
						<CustomEmailSidebar categories={emailCategories} />
						<EmailCustomizer />
					</FlexRow>
				</EmailContainer>
			</Main>
		</Container>
	);
};

export default CustomizeEmail;
