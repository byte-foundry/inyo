import {getApolloContext} from '@apollo/react-common';
import {QueryData} from '@apollo/react-hooks/lib/data/QueryData';
import {useDeepMemo} from '@apollo/react-hooks/lib/utils/useDeepMemo';
import {useContext, useEffect, useState} from 'react';

// TODO: might be better in a context
const queryDataRefs = new Map();
const forceUpdateRefs = new Map();

// taken from https://github.com/apollographql/react-apollo/blob/master/packages/hooks/src/utils/useBaseQuery.ts
export default function useBaseQuery(query, options) {
	const context = useContext(getApolloContext());
	const [tick, forceUpdate] = useState(0);
	const updatedOptions = options ? {...options, query} : {query};

	// we used the serialized options to keep track of the queries
	const queryKey = JSON.stringify(updatedOptions);

	if (!queryDataRefs.has(queryKey)) {
		queryDataRefs.set(
			queryKey,
			new QueryData({
				options: updatedOptions,
				context,
				forceUpdate: () => {
					const snapshotOfForceUpdate = Array.from(
						forceUpdateRefs.values(),
					);

					snapshotOfForceUpdate.forEach((fn) => {
						forceUpdateRefs.delete(fn);
						fn(x => x + 1);
					});
				},
			}),
		);
	}

	const queryData = queryDataRefs.get(queryKey);

	queryData.setOptions(updatedOptions);
	queryData.context = context;

	if (!forceUpdateRefs.has(forceUpdate)) {
		forceUpdateRefs.set(forceUpdate, forceUpdate);
	}

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
			forceUpdateRefs.delete(forceUpdate);
		},
		[],
	);

	const removeForceUpdate = () => {
		forceUpdateRefs.delete(forceUpdate);
	};

	result.observable = queryData.currentObservable.query;
	result.removeForceUpdate = removeForceUpdate;

	return result;
}
