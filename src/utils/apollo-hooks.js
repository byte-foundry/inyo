import {useQuery as useOriginalUseQuery} from '@apollo/react-hooks';

export function useQuery(query, options) {
	const result = useOriginalUseQuery(query, options);

	if (options && options.suspend && result.loading) {
		// weird stuff happening here
		throw new Promise(() => {
			setTimeout(() => {});
		});
	}

	return result;
}

export {useApolloClient, useMutation} from '@apollo/react-hooks';
