import styled from '@emotion/styled/macro';
import React from 'react';

import {H4, H5} from '../../utils/content';
import {formatTitle} from '../../utils/functions';
import {gray70, P, primaryBlack} from '../../utils/new/design-system';

const ClientAddress = styled('div')`
	margin: 20px 0;
`;

const ContactName = styled(H5)`
	font-size: 14px;
	font-weight: 400;
	color: ${gray70};
`;

const ContactInfo = styled(P)`
	font-size: 14px;
	line-height: 1.4;
	color: ${gray70};
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
		name, firstName, lastName, email, title, phone, address,
	},
}) => (
	<ClientAddress>
		<CompanyName>{name}</CompanyName>
		<ContactName>{formatTitle(title, firstName, lastName)}</ContactName>
		{address && (
			<>
				<ContactInfo style={{marginBottom: '0px'}}>
					{address.street}
				</ContactInfo>
				<ContactInfo style={{marginBottom: '0px'}}>
					{address.postalCode} {address.city}, {address.country}
				</ContactInfo>
			</>
		)}
		<ContactInfo>{email}</ContactInfo>
		<ContactInfo>{phone}</ContactInfo>
	</ClientAddress>
);

export default CustomerNameAndAddress;
