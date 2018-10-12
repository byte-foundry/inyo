import React, {Component} from 'react';
import styled from 'react-emotion';
import {Switch, Route, Link} from 'react-router-dom';
import CustomerSee from './customer-see';
import CustomerEdit from './customer-edit';
import CustomerCreate from './customer-create';
import CustomerList from './customer-list';
import CustomerSelect from './customer-select';
import {H3} from '../../../utils/content';

const CustomerMain = styled('div')``;

class Customer extends Component {
	render() {
		return (
			<CustomerMain>
				<Switch>
					<Route
						exact
						path="/app/customer"
						component={CustomerList}
					/>
					<Route path="/app/customer/see" component={CustomerSee} />
					<Route path="/app/customer/edit" component={CustomerEdit} />
					<Route
						path="/app/customer/create"
						component={CustomerCreate}
					/>
					<Route
						path="/app/customer/select"
						component={CustomerSelect}
					/>
				</Switch>
			</CustomerMain>
		);
	}
}

export default Customer;
