import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import styled from 'react-emotion';

import {
	H5, H4, P, primaryNavyBlue, primaryBlue,
} from '../../utils/content';

const ClientAddress = styled('div')`
	margin-bottom: 20px;
`;

const CompanyName = styled(H4)`
	color: ${primaryNavyBlue};
	margin: 0;
	margin-bottom: 10px;
`;

const ContactName = styled(H5)`
	color: ${primaryNavyBlue};
	margin: 0;
	margin-bottom: 10px;
`;

const Phone = styled(P)`
	color: ${primaryBlue};
	font-size: 11px;
	margin: 0;
	margin-bottom: 5px;
`;

const ContactEmail = styled('div')`
	color: ${primaryBlue};
`;

class IssuerNameAndAddress extends Component {
	render() {
		const {
			name, firstName, lastName, phone, email,
		} = this.props.issuer;

		return (
			<ClientAddress>
				<CompanyName>{name}</CompanyName>
				<ContactName>
					{firstName} {lastName}
				</ContactName>
				<ContactEmail>{email}</ContactEmail>
				<Phone>{phone}</Phone>
			</ClientAddress>
		);
	}
}

export default withRouter(IssuerNameAndAddress);
