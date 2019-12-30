import {IntlViewerContext} from 'fbt';
import moment from 'moment';
import React from 'react';

import {useQuery} from '../../utils/apollo-hooks';
import {LoadingLogo} from '../../utils/content';
import {GET_CUSTOMER_LANGUAGE} from '../../utils/queries';

export default function Customer({location}) {
	const query = new URLSearchParams(location.search);
	// const {data, loading} = useQuery(
	// 	GET_QUOTE,
	// 	{variables: {token: query.get('token')}},
	// );

	// if (loading) return <LoadingLogo />;
	// if (!data) return <p>nope</p>

	// if (data.owner.settings.language) {
	// 	IntlViewerContext.locale
	// 		= data.owner.settings.language === 'fr' ? 'fr-FR' : 'en-US';
	// 	moment.locale(data.owner.settings.language);
	// }

	return <div>{query.get('token') || 'lecture seule'}</div>;
}
