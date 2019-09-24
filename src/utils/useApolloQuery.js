import {getApolloContext} from '@apollo/react-common';
import {QueryData} from '@apollo/react-hooks/lib/data/QueryData';
import {useDeepMemo} from '@apollo/react-hooks/lib/utils/useDeepMemo';
import {useContext, useEffect, useReducer} from 'react';

// TODO: might be better in a context
const queryDataRefs = new Map();

// taken from https://github.com/apollographql/react-apollo/blob/master/packages/hooks/src/utils/useBaseQuery.ts
export default function useBaseQuery(query, options) {
	const context = useContext(getApolloContext());
	const [tick, forceUpdate] = useReducer(x => x + 1, 0);
	const updatedOptions = options
		? Object.assign(Object.assign({}, options), {query})
		: {query};

	// we used the serialized options to keep track of the queries
	const queryKey = JSON.stringify(updatedOptions);

	if (!queryDataRefs.has(queryKey)) {
		queryDataRefs.set(
			queryKey,
			new QueryData({
				options: updatedOptions,
				context,
				forceUpdate,
			}),
		);
	}

	const queryData = queryDataRefs.get(queryKey);

	queryData.setOptions(updatedOptions);
	queryData.context = context;
	queryData.forceUpdate = forceUpdate;

	// `onError` and `onCompleted` callback functions will not always have a
	// stable identity, so we'll exclude them from the memoization key to
	// prevent `afterExecute` from being triggered un-necessarily.
	const memo = {
		options: Object.assign(Object.assign({}, updatedOptions), {
			onError: undefined,
			onCompleted: undefined,
		}),
		context,
		tick,
	};

	const result = useDeepMemo(() => queryData.execute(), memo);

	const queryResult = result;

	useEffect(() => queryData.afterExecute({lazy: false}), [
		queryResult.loading,
		queryResult.networkStatus,
		queryResult.error,
		queryResult.data,
	]);

	useEffect(
		() => () => {
			queryData.cleanup();

			queryDataRefs.delete(queryKey);
		},
		[],
	);

	return result;
}
