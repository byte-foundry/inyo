import gql from 'graphql-tag'; // eslint-disable-line import/no-extraneous-dependencies

/** ******** APP QUERIES ********* */
export const GET_NETWORK_STATUS = gql`
	query getNetworkStatus {
		networkStatus @client {
			isConnected
		}
	}
`;

export const GET_ITEMS = gql`
	query getItems {
		template @client {
			items
		}
	}
`;

/** ******** USER QUERIES ********* */
export const CHECK_LOGIN_USER = gql`
	query loggedInUserQuery {
		me {
			email
			id
			firstName
			lastName
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
			company {
				id
				projects {
					id
					name
					viewedByCustomer
					customer {
						name
					}
					issuedAt
					createdAt
					status
					total
				}
			}
		}
	}
`;
export const GET_PROJECT_DATA = gql`
	query getProjectData($projectId: ID!) {
		project(id: $projectId) {
			id
			template
			viewedByCustomer
			name
			status
			createdAt
			deadline
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
					defaultVatRate
					settings {
						askStartProjectConfirmation
						askItemFinishConfirmation
					}
				}
				siret
			}
			customer {
				name
				firstName
				lastName
				email
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
				items {
					status
					id
					name
					unit
					reviewer
					comments {
						createdAt
						id
						views {
							viewer {
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
					description
				}
			}
		}
	}
`;

export const GET_PROJECT_DATA_WITH_TOKEN = gql`
	query getProjectData($projectId: ID!, $token: String) {
		project(id: $projectId, token: $token) {
			id
			template
			name
			status
			issuedAt
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
					defaultVatRate
				}
				siret
			}
			customer {
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
				items {
					status
					id
					name
					unit
					reviewer
					comments {
						createdAt
						id
						views {
							viewer {
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
					pendingUnit
					vatRate
					description
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
