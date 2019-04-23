import {ApolloClient} from 'apollo-client';
import {ApolloLink} from 'apollo-link';
import {BatchHttpLink} from 'apollo-link-batch-http';
import {setContext} from 'apollo-link-context';
import {onError} from 'apollo-link-error';
import {createUploadLink} from 'apollo-upload-client';
import {
	InMemoryCache,
	IntrospectionFragmentMatcher,
} from 'apollo-cache-inmemory';
import WatchedMutationLink from 'apollo-link-watched-mutation';
import introspectionQueryResultData from './fragmentTypes.json';

import createTaskWatchMutation from './mutationLinks/createTask';
import createProjectWatchMutation from './mutationLinks/createProject';
import updateProjectWatchMutation from './mutationLinks/updateProject';
import createCustomerWatchMutation from './mutationLinks/createCustomer';
import removeCustomerWatchMutation from './mutationLinks/removeCustomer';
import updateItemWatchMutation from './mutationLinks/updateItem';
import deleteTaskWatchMutation from './mutationLinks/deleteTask';
import focusTaskWatchMutation from './mutationLinks/focusTask';
import uploadAttachmentsWatchMutation from './mutationLinks/uploadAttachments';
import removeAttachmentWatchMutation from './mutationLinks/removeAttachment';
import removeSectionWatchMutation from './mutationLinks/removeSection';

import {GRAPHQL_API} from './constants';

const options = {
	uri: GRAPHQL_API,
};

const httpLink = ApolloLink.split(
	operation => operation.getContext().hasUpload,
	createUploadLink(options),
	new BatchHttpLink(options),
);

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

const errorLink = onError(({graphQLErrors}) => {
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
	focusTask: focusTaskWatchMutation,
	createProject: createProjectWatchMutation,
	updateProject: updateProjectWatchMutation,
	createCustomer: createCustomerWatchMutation,
	removeCustomer: removeCustomerWatchMutation,
	updateItem: updateItemWatchMutation,
	uploadAttachments: uploadAttachmentsWatchMutation,
	removeAttachment: removeAttachmentWatchMutation,
	removeSection: removeSectionWatchMutation,
});

const client = new ApolloClient({
	link: ApolloLink.from([
		watchLink,
		withToken,
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
