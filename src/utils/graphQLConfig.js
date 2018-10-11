import {ApolloClient} from 'apollo-client';
import {ApolloLink} from 'apollo-link';
import {withClientState} from 'apollo-link-state';
import {createHttpLink} from 'apollo-link-http';
import {setContext} from 'apollo-link-context';
import {onError} from 'apollo-link-error';
import {InMemoryCache} from 'apollo-cache-inmemory';
import merge from 'lodash/merge';

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

const cache = new InMemoryCache({
	dataIdFromObject: o => o.id,
	// addTypename: true,
	// cacheResolvers: {},
	// 	fragmentMatcher: new IntrospectionFragmentMatcher({
	// 		introspectionQueryResultData: yourData
	// 	}),
});

const errorLink = onError(({operation, networkError, graphQLErrors}) => {
	console.log(operation, networkError, graphQLErrors);
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

const client = new ApolloClient({
	link: ApolloLink.from([withToken, errorLink, stateLink, httpLink]),
	cache,
	connectToDevTools: true,
	queryDeduplication: true,
});

const unsubscribe = client.onResetStore(stateLink.writeDefaults);

export default client;
