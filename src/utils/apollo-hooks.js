import {useQuery as useApolloQuery} from '@apollo/react-hooks';

import useBaseQuery from './useApolloQuery';

export function useQuery(query, options) {
	/* eslint-disable */
	const result =
		options && options.suspend
			? useBaseQuery(query, options)
			: useApolloQuery(query, options);
	/* eslint-enable */

	if (options && options.suspend && result.loading) {
		throw result.observable.result();
	}

	return result;
}

export {useApolloClient, useMutation} from '@apollo/react-hooks';
