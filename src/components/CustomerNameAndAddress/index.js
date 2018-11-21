import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import styled from 'react-emotion';

import {H5, H4, primaryNavyBlue} from '../../utils/content';

const ClientAddress = styled('div')``;

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

class CustomerNameAndAddress extends Component {
	render() {
		const {
			name, firstName, lastName, email,
		} = this.props.customer;

		return (
			<ClientAddress>
				<CompanyName>{name}</CompanyName>
				<ContactName>
					{firstName} {lastName}
				</ContactName>
				<ContactName>{email}</ContactName>
			</ClientAddress>
		);
	}
}

export default withRouter(CustomerNameAndAddress);
