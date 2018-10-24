import React, {Component} from 'react';
import styled from 'react-emotion';
import {Switch, Route} from 'react-router-dom';

import CompanyEdit from './company-edit';
import CompanyCreate from './company-create';
import CompanySee from './company-see';

const CompanyMain = styled('div')``;

class Company extends Component {
	render() {
		return (
			<CompanyMain>
				<Switch>
					<Route exact path="/app/company" component={CompanySee} />
					<Route path="/app/company/edit" component={CompanyEdit} />
					<Route
						path="/app/company/create"
						component={CompanyCreate}
					/>
				</Switch>
			</CompanyMain>
		);
	}
}

export default Company;
