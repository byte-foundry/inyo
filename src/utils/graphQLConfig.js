import {ApolloClient} from 'apollo-client';
import {ApolloLink} from 'apollo-link';
import {BatchHttpLink} from 'apollo-link-batch-http';
import {setContext} from 'apollo-link-context';
import {onError} from 'apollo-link-error';
import {
	InMemoryCache,
	IntrospectionFragmentMatcher,
} from 'apollo-cache-inmemory';
import DebounceLink from 'apollo-link-debounce';
import WatchedMutationLink from 'apollo-link-watched-mutation';
import introspectionQueryResultData from './fragmentTypes.json';

import createTaskWatchMutation from './mutationLinks/createTask';
import createProjectWatchMutation from './mutationLinks/createProject';
import deleteTaskWatchMutation from './mutationLinks/deleteTask';

import {GRAPHQL_API} from './constants';

const DEFAULT_DEBOUNCE_TIMEOUT = 100;
const debounceLink = new DebounceLink(DEFAULT_DEBOUNCE_TIMEOUT);

const httpLink = new BatchHttpLink({
	uri: GRAPHQL_API,
});

const withToken = setContext((_, {headers}) => {
	const token = localStorage.getItem('authToken');

	return {
		headers: {
			...headers,
			authorization: token ? `Bearer ${token}` : '',
		},
	};
});

const fragmentMatcher = new IntrospectionFragmentMatcher({
	introspectionQueryResultData,
});

const cache = new InMemoryCache({
	fragmentMatcher,
	dataIdFromObject: o => o.id,
	// addTypename: true,
	// cacheResolvers: {},
	// 	fragmentMatcher: new IntrospectionFragmentMatcher({
	// 		introspectionQueryResultData: yourData
	// 	}),
});

const errorLink = onError(({networkError, graphQLErrors}) => {
	if (graphQLErrors) {
		graphQLErrors.forEach((error) => {
			if (!error.extensions) {
				return;
			}

			switch (error.extensions.code) {
			// disconnect if we know the token is invalid
			case 'Auth':
				window.localStorage.removeItem('authToken');
				break;
			default:
				break;
			}
		});
	}
});

const watchLink = new WatchedMutationLink(cache, {
	addItem: createTaskWatchMutation,
	removeItem: deleteTaskWatchMutation,
	createProject: createProjectWatchMutation,
});

const client = new ApolloClient({
	link: ApolloLink.from([
		watchLink,
		withToken,
		debounceLink,
		errorLink,
		httpLink,
		// Don't put link after httpLink this will not work
		// because it is a terminating link
	]),
	cache,
	connectToDevTools: true,
	queryDeduplication: true,
});

export default client;
