import React, {Component} from 'react';
import styled from 'react-emotion';

import {H3} from '../../../utils/content';

import CustomerForm from '../../../components/CustomerForm';

const CreateCustomerMain = styled('div')``;

class CreateCustomer extends Component {
	render() {
		return (
			<CreateCustomerMain>
				<H3>Create your customer</H3>
				<CustomerForm />
			</CreateCustomerMain>
		);
	}
}

export default CreateCustomer;
