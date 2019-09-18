import {
	InMemoryCache,
	IntrospectionFragmentMatcher,
} from 'apollo-cache-inmemory';
import {ApolloClient} from 'apollo-client';
import {ApolloLink} from 'apollo-link';
import {BatchHttpLink} from 'apollo-link-batch-http';
import {setContext} from 'apollo-link-context';
import {onError} from 'apollo-link-error';
import WatchedMutationLink from 'apollo-link-watched-mutation';
import {createUploadLink} from 'apollo-upload-client';

import {GRAPHQL_API} from './constants';
import introspectionQueryResultData from './fragmentTypes.json';
import acceptCollabRequestWatchMutation from './mutationLinks/acceptCollabRequest';
import createCustomerWatchMutation from './mutationLinks/createCustomer';
import createProjectWatchMutation from './mutationLinks/createProject';
import createSectionWatchMutation from './mutationLinks/createSection';
import createTagWatchMutation from './mutationLinks/createTag';
import createTaskWatchMutation from './mutationLinks/createTask';
import deleteTaskWatchMutation from './mutationLinks/deleteTask';
import focusTaskWatchMutation from './mutationLinks/focusTask';
import removeAttachmentWatchMutation from './mutationLinks/removeAttachment';
import removeCustomerWatchMutation from './mutationLinks/removeCustomer';
import removeProjectWatchMutation from './mutationLinks/removeProject';
import removeSectionWatchMutation from './mutationLinks/removeSection';
import removeTagWatchMutation from './mutationLinks/removeTag';
import requestCollabWatchMutation from './mutationLinks/requestCollab';
import updateItemWatchMutation from './mutationLinks/updateItem';
import updateProjectWatchMutation from './mutationLinks/updateProject';
import uploadAttachmentsWatchMutation from './mutationLinks/uploadAttachments';

const options = {
	uri: 'http://localhost:4000',
};

const httpLink = ApolloLink.split(
	operation => operation.getContext().hasUpload,
	createUploadLink(options),
	new BatchHttpLink(options),
);

const withToken = setContext((op, {headers}) => {
	const token = localStorage.getItem('authToken');

	return {
		headers: {
			...headers,
			authorization: token ? `Bearer ${token}` : '',
			tokenFromRequest: op.variables.token || '',
		},
	};
});

const fragmentMatcher = new IntrospectionFragmentMatcher({
	introspectionQueryResultData,
});

const cache = new InMemoryCache({
	fragmentMatcher,
	dataIdFromObject: o => o.id,
	cacheRedirects: {
		Query: {
			item: (_, args, {getCacheKey}) => getCacheKey({__typename: 'Item', id: args.id}),
		},
	},
	freezeResults: true,
});

const errorLink = onError(({graphQLErrors, networkError}) => {
	if (graphQLErrors) {
		graphQLErrors.forEach(({message, extensions}) => {
			console.log(`[GraphQL error]: Message: ${message}`);

			if (!extensions) {
				return;
			}

			switch (extensions.code) {
			// disconnect if we know the token is invalid
			case 'Auth':
				window.localStorage.removeItem('authToken');
				break;
			default:
				break;
			}
		});
	}
	if (networkError) console.log(`[Network error]: ${networkError}`);
});

const watchLink = new WatchedMutationLink(cache, {
	acceptCollabRequest: acceptCollabRequestWatchMutation,
	addItem: createTaskWatchMutation,
	addSection: createSectionWatchMutation,
	createProject: createProjectWatchMutation,
	createCustomer: createCustomerWatchMutation,
	createTag: createTagWatchMutation,
	focusTask: focusTaskWatchMutation,
	removeAttachment: removeAttachmentWatchMutation,
	removeCustomer: removeCustomerWatchMutation,
	removeItem: deleteTaskWatchMutation,
	removeProject: removeProjectWatchMutation,
	removeSection: removeSectionWatchMutation,
	removeTag: removeTagWatchMutation,
	requestCollab: requestCollabWatchMutation,
	updateItem: updateItemWatchMutation,
	updateProject: updateProjectWatchMutation,
	uploadAttachments: uploadAttachmentsWatchMutation,
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
