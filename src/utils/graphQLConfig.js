import {ApolloClient} from 'apollo-client'; // eslint-disable-line import/no-extraneous-dependencies
import {ApolloLink} from 'apollo-link'; // eslint-disable-line import/no-extraneous-dependencies
import {withClientState} from 'apollo-link-state'; // eslint-disable-line import/no-extraneous-dependencies
import {createHttpLink} from 'apollo-link-http'; // eslint-disable-line import/no-extraneous-dependencies
import {setContext} from 'apollo-link-context';
import {onError} from 'apollo-link-error'; // eslint-disable-line import/no-extraneous-dependencies
import {
	InMemoryCache,
	IntrospectionFragmentMatcher,
} from 'apollo-cache-inmemory'; // eslint-disable-line import/no-extraneous-dependencies
import DebounceLink from 'apollo-link-debounce';
import WatchedMutationLink from 'apollo-link-watched-mutation'; // eslint-disable-line import/no-extraneous-dependencies
import introspectionQueryResultData from './fragmentTypes.json';

import createTaskWatchMutation from './mutationLinks/createTask.js';
import {GRAPHQL_API} from './constants';
import defaults from './default';
import resolvers from './resolvers';
import typeDefs from './typedefs';

export const ERRORS = {
	GraphQLArgumentsException: 3000,
	IdIsInvalid: 3001,
	DataItemDoesNotExist: 3002,
	IdIsMissing: 3003,
	DataItemAlreadyExists: 3004,
	ExtraArguments: 3005,
	InvalidValue: 3006,
	ValueTooLong: 3007,
	InsufficientPermissions: 3008,
	RelationAlreadyFull: 3009,
	UniqueConstraintViolation: 3010,
	NodeDoesNotExist: 3011,
	ItemAlreadyInRelation: 3012,
	NodeNotFoundError: 3013,
	InvalidConnectionArguments: 3014,
	InvalidToken: 3015,
	ProjectNotFound: 3016,
	InvalidSigninData: 3018,
	ReadonlyField: 3019,
	FieldCannotBeNull: 3020,
	CannotCreateUserWhenSignedIn: 3021,
	CannotSignInCredentialsInvalid: 3022,
	CannotSignUpUserWithCredentialsExist: 3023,
	VariablesParsingError: 3024,
	Auth0IdTokenIsInvalid: 3025,
	InvalidFirstArgument: 3026,
	InvalidLastArgument: 3027,
	InvalidSkipArgument: 3028,
	GenericServerlessFunctionError: 3031,
	RelationIsRequired: 3032,
	FilterCannotBeNullOnToManyField: 3033,
	UnhandledFunctionError: 3034,
};

const DEFAULT_DEBOUNCE_TIMEOUT = 100;
const debounceLink = new DebounceLink(DEFAULT_DEBOUNCE_TIMEOUT);

const httpLink = createHttpLink({
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
	if (networkError) {
		cache.writeData({
			data: {
				networkStatus: {
					__typename: 'NetworkStatus',
					isConnected: true,
				},
			},
		});
	}

	if (graphQLErrors) {
		graphQLErrors.forEach((error) => {
			switch (error.code) {
			// disconnect if we know the token is invalid
			case ERRORS.InvalidToken:
				window.localStorage.removeItem('authToken');
				break;
			default:
				break;
			}
		});
	}
});

const stateLink = withClientState({
	resolvers,
	defaults,
	cache,
	typeDefs,
});

const watchLink = new WatchedMutationLink(cache, {
	addItem: createTaskWatchMutation,
});

const client = new ApolloClient({
	link: ApolloLink.from([
		watchLink,
		withToken,
		debounceLink,
		errorLink,
		stateLink,
		httpLink,
		// Don't put link after httpLink this will not work
		// because it is a terminating link
	]),
	cache,
	connectToDevTools: true,
	queryDeduplication: true,
});

client.onResetStore(stateLink.writeDefaults);

export default client;
