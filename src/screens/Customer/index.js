import React, {useContext} from 'react';
import {Switch, Route} from 'react-router-dom';

import {CustomerContext} from '../../utils/contexts';

export default function Customer({match}) {
	return (
		<CustomerContext.Provider customerToken={match.params.customerToken}>
			<Switch>
				<Route path="/app/:customerToken/tasks" />
			</Switch>
		</CustomerContext.Provider>
	);
}
