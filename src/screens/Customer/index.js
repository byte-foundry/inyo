import {IntlViewerContext} from 'fbt';
import moment from 'moment';
import React from 'react';
import {Route, Switch} from 'react-router-dom';

import {useQuery} from '../../utils/apollo-hooks';
import {CustomerContext} from '../../utils/contexts';
import {GET_CUSTOMER_LANGUAGE} from '../../utils/queries';
import CustomerTasks from './Tasks';

export default function Customer({match}) {
	const {data: dataLanguage, loading: loadingLanguage} = useQuery(
		GET_CUSTOMER_LANGUAGE,
		{
			variables: {
				token: match.params.customerToken,
			},
			suspend: true,
			fetchPolicy: 'network-only',
		},
	);

	if (
		dataLanguage
		&& dataLanguage.customer
		&& dataLanguage.customer.language
	) {
		IntlViewerContext.locale
			= dataLanguage.customer.language === 'fr' ? 'fr-FR' : 'en-US';
		moment.locale(dataLanguage.customer.language);
	}

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
