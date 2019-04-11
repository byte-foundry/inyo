import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import styled from '@emotion/styled/macro';

import {H4, H5} from '../../utils/content';
import {P, accentGrey, primaryBlack} from '../../utils/new/design-system';

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

class IssuerNameAndAddress extends Component {
	render() {
		const {name, phone, owner} = this.props.issuer;

		return (
			<ClientAddress>
				<CompanyName>{name}</CompanyName>
				<ContactName>
					{owner.firstName} {owner.lastName}
				</ContactName>
				<ContactInfo>{owner.email}</ContactInfo>
				<ContactInfo>{phone}</ContactInfo>
			</ClientAddress>
		);
	}
}

export default withRouter(IssuerNameAndAddress);
