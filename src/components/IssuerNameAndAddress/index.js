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

const Siret = styled(P)`
	color: ${primaryBlue};
	font-size: 11px;
	margin: 0;
	margin-bottom: 5px;
`;

const Phone = styled(P)`
	color: ${primaryBlue};
	font-size: 11px;
	margin: 0;
	margin-bottom: 5px;
`;

const AddressBlock = styled('div')`
	border-top: 1px solid ${primaryBlue};
	padding-top: 10px;
`;

const Address = styled(P)`
	color: ${primaryBlue};
	font-size: 11px;
	margin: 0;
	margin-bottom: 5px;
`;

class IssuerNameAndAddress extends Component {
	render() {
		const {
			name,
			firstName,
			lastName,
			address,
			siret,
			phone,
		} = this.props.issuer;

		return (
			<ClientAddress>
				<CompanyName>{name}</CompanyName>
				<ContactName>
					{firstName} {lastName}
				</ContactName>
				<Siret>SIRET: {siret}</Siret>
				<AddressBlock>
					<Address>{address.street}</Address>
					<Address>
						{address.postalCode} {address.city}
					</Address>
					<Address>{address.country}</Address>
				</AddressBlock>
				<Phone>{phone}</Phone>
			</ClientAddress>
		);
	}
}

export default withRouter(IssuerNameAndAddress);
