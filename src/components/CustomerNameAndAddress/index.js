import React from 'react';
import styled from '@emotion/styled/macro';

import {H4, H5} from '../../utils/content';
import {P} from '../../utils/new/design-system';

const ClientAddress = styled('div')`
	margin: 20px 0;
`;

const ContactName = styled(H5)`
	font-size: 14px;
	font-weight: 400;
	color: #333;
`;

const ContactInfo = styled(P)`
	font-size: 14px;
	line-height: 1.4;
	color: #888;
	margin-top: 0;
`;

const CompanyName = styled(H4)`
	font-size: 16px;
	font-weight: 500;
	color: #888;

	& + ${ContactName} {
		margin-bottom: 0;
	}
`;

const titleEnumToTitle = {
	MONSIEUR: 'M.',
	MADAME: 'Mme',
};

const CustomerNameAndAddress = ({
	customer: {
		name, firstName, lastName, email, title, phone,
	},
}) => (
	<ClientAddress>
		<CompanyName>{name}</CompanyName>
		<ContactName>
			{titleEnumToTitle[title]} {firstName} {lastName}
		</ContactName>
		<ContactInfo>{email}</ContactInfo>
		<ContactInfo>{phone}</ContactInfo>
	</ClientAddress>
);

export default CustomerNameAndAddress;
