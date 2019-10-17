import styled from '@emotion/styled/macro';
import React from 'react';

import {H4, H5} from '../../utils/content';
import {formatTitle} from '../../utils/functions';
import {accentGrey, P, primaryBlack} from '../../utils/new/design-system';

const ClientAddress = styled('div')`
	margin: 20px 0;
`;

const ContactName = styled(H5)`
	font-size: 14px;
	font-weight: 400;
	color: ${accentGrey};
`;

const ContactInfo = styled(P)`
	font-size: 14px;
	line-height: 1.4;
	color: ${accentGrey};
	margin-top: 0;
`;

const CompanyName = styled(H4)`
	font-size: 16px;
	font-weight: 500;
	color: ${primaryBlack};

	& + ${ContactName} {
		margin-bottom: 0;
	}
`;

const CustomerNameAndAddress = ({
	customer: {
		name, firstName, lastName, email, title, phone,
	},
}) => (
	<ClientAddress>
		<CompanyName>{name}</CompanyName>
		<ContactName>{formatTitle(title, firstName, lastName)}</ContactName>
		<ContactInfo>{email}</ContactInfo>
		<ContactInfo>{phone}</ContactInfo>
	</ClientAddress>
);

export default CustomerNameAndAddress;
