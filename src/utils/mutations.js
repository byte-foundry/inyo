import gql from 'graphql-tag'; // eslint-disable-line import/no-extraneous-dependencies

/** ******** USER GENERIC MUTATIONS ********* */
export const LOGIN = gql`
	mutation Login($email: String!, $password: String!) {
		login(email: $email, password: $password) {
			token
			user {
				id
				email
				firstName
				lastName
			}
		}
	}
`;

export const SIGNUP = gql`
	mutation Signup(
		$email: String!
		$password: String!
		$firstName: String!
		$lastName: String!
	) {
		signup(
			email: $email
			password: $password
			firstName: $firstName
			lastName: $lastName
		) {
			token
			user {
				id
				email
				firstName
				lastName
			}
		}
	}
`;

export const UPDATE_USER = gql`
	mutation UpdateUser($firstName: String, $lastName: String, $email: String) {
		updateUser(firstName: $firstName, lastName: $lastName, email: $email) {
			id
			email
			firstName
			lastName
			defaultDailyPrice
			defaultVatRate
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

export const UPDATE_USER_CONSTANTS = gql`
	mutation UpdateUser(
		$defaultDailyPrice: Int
		$defaultVatRate: Int
		$workingFields: [String!]
		$jobType: JobType
		$interestedFeatures: [String!]
		$hasUpcomingProject: Boolean
		$startWorkAt: Time
		$endWorkAt: Time
		$workingDays: [DAY!]
	) {
		updateUser(
			defaultDailyPrice: $defaultDailyPrice
			defaultVatRate: $defaultVatRate
			workingFields: $workingFields
			jobType: $jobType
			interestedFeatures: $interestedFeatures
			hasUpcomingProject: $hasUpcomingProject
			startWorkAt: $startWorkAt
			endWorkAt: $endWorkAt
			workingDays: $workingDays
		) {
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

// Update User settings
export const UPDATE_USER_SETTINGS = gql`
	mutation UpdateUser($settings: SettingsInput!) {
		updateUser(settings: $settings) {
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
/** ******** COMPANY MUTATIONS ********* */

export const UPDATE_USER_COMPANY = gql`
	mutation UpdateUser($company: CompanyInput) {
		updateUser(company: $company) {
			id
			email
			firstName
			lastName
			defaultDailyPrice
			defaultVatRate
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

/** ******** CUSTOMER MUTATIONS ********* */

export const CREATE_CUSTOMER = gql`
	mutation CreateCustomer($customer: CustomerInput) {
		createCustomer(customer: $customer) {
			id
		}
	}
`;
/** ******** PROJECT MUTATIONS ********* */

export const EDIT_ITEMS = gql`
	mutation EditItems($items: [String!]!) {
		editItems(items: $items) @client {
			items
		}
	}
`;
// Project
export const CREATE_PROJECT = gql`
	# creating project with a customer id or a new customer
	mutation createProject(
		$customerId: ID
		$customer: CustomerInput
		$template: ProjectTemplate!
		$sections: [SectionInput!]
		$name: String
		$deadline: DateTime
	) {
		createProject(
			customerId: $customerId
			customer: $customer
			template: $template
			sections: $sections
			name: $name
			deadline: $deadline
		) {
			id
			name
			viewedByCustomer
			deadline
			customer {
				name
			}
			issuedAt
			createdAt
			status
			total
		}
	}
`;
export const UPDATE_PROJECT = gql`
	# creating project with a customer id or a new customer
	mutation updateProject($projectId: ID!, $name: String!) {
		updateProject(id: $projectId, name: $name) {
			id
			name
		}
	}
`;
export const START_PROJECT = gql`
	# creating project with a customer id or a new customer
	mutation startProject($projectId: ID!, $notifyCustomer: Boolean) {
		startProject(id: $projectId, notifyCustomer: $notifyCustomer) {
			id
			status
			viewedByCustomer
		}
	}
`;

export const REMOVE_PROJECT = gql`
	mutation removeProject($projectId: ID!) {
		removeProject(id: $projectId) {
			id
		}
	}
`;

export const ACCEPT_PROJECT = gql`
	# creating project with a customer id or a new customer
	mutation acceptProject($projectId: ID!, $token: String!) {
		acceptProject(id: $projectId, token: $token) {
			id
			status
		}
	}
`;

export const REJECT_PROJECT = gql`
	# creating project with a customer id or a new customer
	mutation rejectProject($projectId: ID!, $token: String!) {
		rejectProject(id: $projectId, token: $token) {
			id
			status
		}
	}
`;

export const FINISH_PROJECT = gql`
	mutation finishProject($projectId: ID!) {
		finishProject(id: $projectId) {
			id
			status
		}
	}
`;

// Section
export const ADD_SECTION = gql`
	mutation addSection($projectId: ID!, $name: String!, $items: [ItemInput!]) {
		addSection(projectId: $projectId, name: $name, items: $items) {
			id
			name
			items {
				id
				name
				unit
				description
				reviewer
			}
		}
	}
`;
export const UPDATE_SECTION = gql`
	mutation updateSection($sectionId: ID!, $name: String!) {
		updateSection(id: $sectionId, name: $name) {
			id
			name
			items {
				status
				id
				name
				unit
				description
				reviewer
			}
		}
	}
`;
export const REMOVE_SECTION = gql`
	mutation removeSection($sectionId: ID!) {
		removeSection(id: $sectionId) {
			id
		}
	}
`;
// Item
export const ADD_ITEM = gql`
	mutation addItem(
		$sectionId: ID!
		$name: String!
		$unit: Float
		$vatRate: Int
		$description: String
		$reviewer: Reviewer
	) {
		addItem(
			sectionId: $sectionId
			name: $name
			unit: $unit
			vatRate: $vatRate
			description: $description
			reviewer: $reviewer
		) {
			id
			name
			unit
			description
			status
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
		}
	}
`;
export const UPDATE_ITEM = gql`
	mutation updateItem(
		$itemId: ID!
		$name: String
		$description: String
		$unit: Float
		$comment: CommentInput
		$reviewer: Reviewer
	) {
		updateItem(
			id: $itemId
			name: $name
			description: $description
			comment: $comment
			unit: $unit
			reviewer: $reviewer
		) {
			id
			name
			unit
			description
			status
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
		}
	}
`;

export const FINISH_ITEM = gql`
	mutation finishItem($itemId: ID!, $token: String) {
		finishItem(id: $itemId, token: $token) {
			id
			status
		}
	}
`;

export const REMOVE_ITEM = gql`
	mutation removeItem($itemId: ID!) {
		removeItem(id: $itemId) {
			id
		}
	}
`;

export const SNOOZE_ITEM = gql`
	mutation snoozeItem($itemId: ID!, $during: Int) {
		snoozeItem(id: $itemId, during: $during) {
			id
			status
		}
	}
`;

export const SEND_AMENDMENT = gql`
	mutation sendAmendment($projectId: ID!) {
		sendAmendment(projectId: $projectId) {
			id
			template
			name
			viewedByCustomer
			status
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
					description
					reviewer
				}
			}
		}
	}
`;

export const ACCEPT_AMENDMENT = gql`
	mutation acceptAmendment($projectId: ID!, $token: String!) {
		acceptAmendment(projectId: $projectId, token: $token) {
			id
			template
			name
			status
			issuer {
				name
				email
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

export const REJECT_AMENDMENT = gql`
	mutation rejectAmendment($projectId: ID!, $token: String!) {
		rejectAmendment(projectId: $projectId, token: $token) {
			id
			template
			name
			status
			issuer {
				name
				email
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

export const ACCEPT_ITEM = gql`
	mutation acceptItem($itemId: ID!, $token: String!) {
		acceptItem(id: $itemId, token: $token) {
			id
			status
			unit
		}
	}
`;

export const REJECT_ITEM = gql`
	mutation rejectItem($itemId: ID!, $token: String!) {
		rejectItem(id: $itemId, token: $token) {
			id
			status
			unit
		}
	}
`;

export const POST_COMMENT = gql`
	mutation postComment(
		$itemId: ID!
		$token: String
		$comment: CommentInput!
	) {
		postComment(itemId: $itemId, token: $token, comment: $comment) {
			id
			comments {
				createdAt
				id
				text
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
		}
	}
`;

export const CHECK_UNIQUE_EMAIL = gql`
	mutation checkEmailAvailability($email: String!) {
		isAvailable: checkEmailAvailability(email: $email)
	}
`;
