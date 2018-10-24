import React, {Component} from 'react';
import styled from 'react-emotion';

import {H3} from '../../../utils/content';

const SelectCustomerMain = styled('div')``;

class SelectCustomer extends Component {
	render() {
		return (
			<SelectCustomerMain>
				<H3>Select your customer</H3>
			</SelectCustomerMain>
		);
	}
}

export default SelectCustomer;
