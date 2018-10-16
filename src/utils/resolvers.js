/*
    The resolver map is an object with resolver functions for each GraphQL object type.
    You can think of a GraphQL query or mutation as a tree of function calls for each field.
    These function calls resolve to data or another function call.
*/
import {GET_TASK_ITEMS} from './queries';

export default {
	Mutation: {
		updateNetworkStatus: (_, {isConnected}, {cache}) => {
			const networkStatus = {
				isConnected,
				__typename: 'NetworkStatus',
			};

			cache.writeData({data: networkStatus});

			return networkStatus;
		},
	},
	Mutation: {
		editTaskItems: (_, {taskItems}, {cache}) => {
			const previous = cache.readQuery({query: GET_TASK_ITEMS});
			const data = {
				taskTemplate: {
					...previous.taskTemplate,
					taskItems,
				},
			};

			cache.writeQuery({query: GET_TASK_ITEMS, data});

			return data;
		},
	},
};
