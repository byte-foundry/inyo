import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import styled from '@emotion/styled';

import {
	H5, H4, H3, P, primaryNavyBlue, primaryBlue,
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

const Title = styled(H3)`
	font-size: 13px;
	margin: 0;
	margin-bottom: 10px;
	text-transform: uppercase;
`;

class IssuerNameAndAddress extends Component {
	render() {
		const {name, phone, owner} = this.props.issuer;

		return (
			<ClientAddress>
				<Title>Votre prestataire</Title>
				<CompanyName>{name}</CompanyName>
				<ContactName>
					{owner.firstName} {owner.lastName}
				</ContactName>
				<ContactEmail>{owner.email}</ContactEmail>
				<Phone>{phone}</Phone>
			</ClientAddress>
		);
	}
}

export default withRouter(IssuerNameAndAddress);
