import React, {Component} from 'react';
import styled from 'react-emotion';
import {Redirect} from 'react-router-dom';

import {H1} from '../../../utils/content';

const DashboardMain = styled('div')``;

class Dashboard extends Component {
	render() {
		return (
			<DashboardMain>
				<H1>Dashboard</H1>
				<Redirect to="/app/quotes" />
			</DashboardMain>
		);
	}
}

export default Dashboard;
