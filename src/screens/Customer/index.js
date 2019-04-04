import React from 'react';
import {Switch, Route} from 'react-router-dom';

import {CustomerContext} from '../../utils/contexts';

import CustomerTasks from './Tasks';

export default function Customer({match}) {
	return (
		<CustomerContext.Provider value={match.params.customerToken}>
			<Switch>
				<Route
					path="/app/:customerToken/tasks"
					component={CustomerTasks}
				/>
			</Switch>
		</CustomerContext.Provider>
	);
}
