import React, {Component} from 'react';
import styled from 'react-emotion';
import {H3} from '../../../utils/content';

const EditCustomerMain = styled('div')``;

class EditCustomer extends Component {
	render() {
		return (
			<EditCustomerMain>
				<H3>Edit your customer</H3>
			</EditCustomerMain>
		);
	}
}

export default EditCustomer;
