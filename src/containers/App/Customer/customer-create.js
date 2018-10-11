import React, {Component} from 'react';
import styled from 'react-emotion';
import {H3} from '../../../utils/content';

const CreateCustomerMain = styled('div')``;

class CreateCustomer extends Component {
	render() {
		return (
			<CreateCustomerMain>
				<H3>Create your customer</H3>
			</CreateCustomerMain>
		);
	}
}

export default CreateCustomer;
