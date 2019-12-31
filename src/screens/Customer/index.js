import {IntlViewerContext} from 'fbt';
import moment from 'moment';
import React from 'react';
import {Route, Switch} from 'react-router-dom';

import {useQuery} from '../../utils/apollo-hooks';
import {CustomerContext} from '../../utils/contexts';
import {GET_CUSTOMER_LANGUAGE} from '../../utils/queries';
import Quote from './Quote';
import CustomerTasks from './Tasks';

export default function Customer({match}) {
	const {data: dataLanguage} = useQuery(GET_CUSTOMER_LANGUAGE, {
		variables: {
			token: match.params.customerToken,
		},
		fetchPolicy: 'network-only',
	});

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
				<Route
					path="/app/:customerToken/quotes/:quoteId"
					component={Quote}
				/>
			</Switch>
		</CustomerContext.Provider>
	);
}
