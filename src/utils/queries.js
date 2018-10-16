import gql from 'graphql-tag';

export const GET_NETWORK_STATUS = gql`
	query getNetworkStatus {
		networkStatus @client {
			isConnected
		}
	}
`;

export const CHECK_LOGIN_USER = gql`
	query loggedInUserQuery {
		me {
			id
		}
	}
`;

export const GET_USER_CUSTOMERS = gql`
	query userCustomersQuery {
		me {
			id
			company {
				id
				customers {
					id
					name
					email
					address {
						street
						city
						postalCode
						country
					}
					phone
					siret
					rcs
					rm
					vat
				}
			}
		}
	}
`;

export const GET_USER_INFOS = gql`
	query userInfosQuery {
		me {
			id
			email
			firstName
			lastName
			company {
				id
				name
				email
				address {
					street
					city
					postalCode
					country
				}
				phone
				siret
				rcs
				rm
				vat
			}
		}
	}
`;
