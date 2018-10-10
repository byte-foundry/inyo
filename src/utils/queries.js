import gql from 'graphql-tag';

export const GET_NETWORK_STATUS = gql`
	query getNetworkStatus {
		networkStatus @client {
			isConnected
		}
	}
`;

export const GET_USER_INFOS = gql`
	query loggedInUserQuery {
		me {
			id
		}
	}
`;