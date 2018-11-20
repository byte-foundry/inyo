import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import styled from 'react-emotion';

import {
	H3,
	H5,
	H4,
	P,
	primaryNavyBlue,
	primaryBlue,
	gray20,
} from '../../utils/content';
import {nonEmpty} from '../../utils/functions.js';

const ClientAddress = styled('div')`
	margin-top: 20px;
`;

const ClientTitle = styled(H3)`
	font-size: 13px;
	margin: 0;
	margin-bottom: 5px;
`;

const CompanyName = styled(H4)`
	color: ${primaryNavyBlue};
	margin: 0;
	margin-bottom: 10px;
`;

const ContactName = styled('div')`
	margin: 0;
	margin-bottom: 10px;
`;

const ContactEmail = styled('div')``;

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

class CustomerNameAndAddress extends Component {
	render() {
		const {
			name,
			firstName,
			lastName,
			address,
			email,
			title,
		} = this.props.customer;

		return (
			<ClientAddress>
				<ClientTitle>Votre client</ClientTitle>
				<CompanyName>{name}</CompanyName>
				<ContactName>
					{nonEmpty`${title} ${firstName} ${lastName}`.trimRight()}
				</ContactName>
				<ContactEmail>{email}</ContactEmail>
			</ClientAddress>
		);
	}
}

export default withRouter(CustomerNameAndAddress);
