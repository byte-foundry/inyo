import {useQuery as useApolloQuery} from '@apollo/react-hooks';

import useBaseQuery from './useApolloQuery';

export function useQuery(query, options) {
	// eslint-disable-next-line
	const result =
		options && options.suspend
			? useBaseQuery(query, options)
			: useApolloQuery(query, options);

	if (options && options.suspend && result.loading) {
		// weird stuff happening here
		throw new Promise(() => {
			setTimeout(() => {});
		});
	}

	return result;
}

export {useApolloClient, useMutation} from '@apollo/react-hooks';
