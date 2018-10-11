import React, {Component} from 'react';
import styled from 'react-emotion';
import {H3} from '../../../utils/content';

const ListCustomersMain = styled('div')``;

class ListCustomers extends Component {
	render() {
		return (
			<ListCustomersMain>
				<H3>List your customers</H3>
			</ListCustomersMain>
		);
	}
}

export default ListCustomers;
