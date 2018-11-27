import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import styled from 'react-emotion';

import {H3, H4, primaryNavyBlue} from '../../utils/content';
import {nonEmpty} from '../../utils/functions';

const ClientAddress = styled('div')`
	margin-top: 20px;
`;

const ClientTitle = styled(H3)`
	font-size: 13px;
	margin: 0;
	margin-bottom: 10px;
	text-transform: uppercase;
`;

const CompanyName = styled(H4)`
	color: ${primaryNavyBlue};
	margin: 0;
	margin-bottom: 7px;
`;

const ContactInfo = styled('div')`
	margin: 0;
	margin-bottom: 6px;
`;

class CustomerNameAndAddress extends Component {
	render() {
		const {
			name,
			firstName,
			lastName,
			email,
			title,
			phone,
		} = this.props.customer;

		return (
			<ClientAddress>
				<ClientTitle>Votre client</ClientTitle>
				<CompanyName>{name}</CompanyName>
				<ContactInfo>
					{nonEmpty`${title} ${firstName} ${lastName}`.trimRight()}
				</ContactInfo>
				<ContactInfo>{email}</ContactInfo>
				<ContactInfo>{phone}</ContactInfo>
			</ClientAddress>
		);
	}
}

export default withRouter(CustomerNameAndAddress);
