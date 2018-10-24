import React, {Component} from 'react';
import styled from 'react-emotion';

import {H3} from '../../../utils/content';

const SeeCustomerMain = styled('div')``;

class SeeCustomer extends Component {
	render() {
		return (
			<SeeCustomerMain>
				<H3>See your customer</H3>
			</SeeCustomerMain>
		);
	}
}

export default SeeCustomer;
