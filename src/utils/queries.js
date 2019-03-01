import gql from 'graphql-tag';

import {ITEM_FRAGMENT, PROJECT_CUSTOMER_FRAGMENT} from './fragments';

/** ******** USER QUERIES ********* */
export const CHECK_LOGIN_USER = gql`
	query loggedInUserQuery {
		me {
			email
			id
			hmacIntercomId
			firstName
			lastName
			workingDays
			startWorkAt
			endWorkAt
			company {
				phone
			}
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
			defaultDailyPrice
			defaultVatRate
			workingFields
			jobType
			interestedFeatures
			hasUpcomingProject
			startWorkAt
			endWorkAt
			workingDays
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
			settings {
				askItemFinishConfirmation
				askStartProjectConfirmation
			}
		}
	}
`;

/** ******** PROJECT QUERIES ********* */

export const GET_ALL_PROJECTS = gql`
	query getAllProjectsQuery {
		me {
			id
			projects {
				id
				name
				viewedByCustomer
				customer {
					id
					name
				}
				issuedAt
				createdAt
				status
				total
			}
		}
	}
`;

export const GET_PROJECT_INFOS = gql`
	${PROJECT_CUSTOMER_FRAGMENT}

	query getProjectData($projectId: ID!) {
		project(id: $projectId) {
			id
			template
			viewedByCustomer
			name
			status
			createdAt
			deadline
			daysUntilDeadline
			notifyActivityToCustomer
			total
			sections {
				id
				name
				position
				project {
					id
					deadline
					daysUntilDeadline
					status
					name
					customer {
						id
						name
					}
				}
				items {
					id
					status
					unit
				}
			}
			issuer {
				name
				email
				phone
				address {
					street
					city
					postalCode
					country
				}
				owner {
					firstName
					lastName
					email
					defaultVatRate
					settings {
						askStartProjectConfirmation
						askItemFinishConfirmation
					}
				}
				siret
			}
			customer {
				...ProjectCustomerFragment
			}
		}
	}
`;

export const GET_PROJECT_DATA = gql`
	${ITEM_FRAGMENT}

	query getProjectData($projectId: ID!) {
		project(id: $projectId) {
			id
			template
			viewedByCustomer
			name
			status
			createdAt
			deadline
			daysUntilDeadline
			notifyActivityToCustomer
			issuer {
				name
				email
				phone
				address {
					street
					city
					postalCode
					country
				}
				owner {
					firstName
					lastName
					email
					defaultVatRate
					settings {
						askStartProjectConfirmation
						askItemFinishConfirmation
					}
				}
				siret
			}
			customer {
				id
				name
				firstName
				lastName
				email
				title
				phone
				address {
					street
					city
					postalCode
					country
				}
			}
			sections {
				id
				name
				position
				project {
					id
					deadline
					daysUntilDeadline
					status
					name
					customer {
						id
						name
					}
				}
				items {
					...ItemFragment
				}
			}
		}
	}
`;

export const GET_PROJECT_DATA_WITH_TOKEN = gql`
	${ITEM_FRAGMENT}

	query getProjectDataWithToken($projectId: ID!, $token: String) {
		project(id: $projectId, token: $token) {
			id
			template
			name
			status
			deadline
			daysUntilDeadline
			issuer {
				name
				email
				phone
				address {
					street
					city
					postalCode
					country
				}
				owner {
					firstName
					lastName
					email
					defaultVatRate
				}
				siret
			}
			customer {
				id
				name
				firstName
				lastName
				email
				address {
					street
					city
					postalCode
					country
				}
			}
			sections {
				id
				name
				position
				project {
					id
					deadline
					daysUntilDeadline
					status
					name
					customer {
						id
						name
					}
				}
				items {
					...ItemFragment
				}
			}
		}
	}
`;

/** ******** COMMENT QUERIES ********* */
export const GET_COMMENTS_BY_ITEM = gql`
	query getCommentsFromItemId($itemId: ID!, $token: String) {
		itemComments(itemId: $itemId, token: $token) {
			id
			text
			createdAt
			author {
				... on User {
					firstName
					lastName
				}
				... on Customer {
					firstName
					lastName
					name
				}
			}
		}
	}
`;

export const GET_ITEM_DETAILS = gql`
	${ITEM_FRAGMENT}

	query getItemDetails($id: ID!, $token: String) {
		item(id: $id, token: $token) {
			...ItemFragment
		}
	}
`;

export const GET_ALL_TASKS = gql`
	${ITEM_FRAGMENT}

	query getAllTasks($linkedCustomerId: ID) {
		me {
			id
			tasks(filter: {linkedCustomerId: $linkedCustomerId}) {
				...ItemFragment
			}
		}
	}
`;

export const GET_ALL_CUSTOMERS = gql`
	query getAllCustomers {
		me {
			id
			customers {
				id
				name
			}
		}
	}
`;

export const USER_TASKS = gql`
	${ITEM_FRAGMENT}
	query userTasks {
		me {
			id
			startWorkAt
			endWorkAt
		}
		tasks {
			...ItemFragment
		}
	}
`;
