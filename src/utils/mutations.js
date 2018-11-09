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
				logo {
					url
				}
				phone
				siret
				rcs
				rm
				vat
			}
			settings {
				askItemFinishConfirmation
				askSendQuoteConfirmation
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
	) {
		updateUser(
			defaultDailyPrice: $defaultDailyPrice
			defaultVatRate: $defaultVatRate
			workingFields: $workingFields
			jobType: $jobType
			interestedFeatures: $interestedFeatures
			hasUpcomingProject: $hasUpcomingProject
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
				logo {
					url
				}
				phone
				siret
				rcs
				rm
				vat
			}
			settings {
				askItemFinishConfirmation
				askSendQuoteConfirmation
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
				logo {
					url
				}
				phone
				siret
				rcs
				rm
				vat
			}
			settings {
				askItemFinishConfirmation
				askSendQuoteConfirmation
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
				logo {
					url
				}
				phone
				siret
				rcs
				rm
				vat
			}
			settings {
				askItemFinishConfirmation
				askSendQuoteConfirmation
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
/** ******** QUOTE MUTATIONS ********* */

export const EDIT_ITEMS = gql`
	mutation EditItems($items: [String!]!) {
		editItems(items: $items) @client {
			items
		}
	}
`;
// Quote
export const CREATE_QUOTE = gql`
	# creating quote with a customer id or a new customer
	mutation createQuote(
		$customerId: ID
		$customer: CustomerInput
		$template: QuoteTemplate!
		$option: OptionInput
		$name: String
	) {
		createQuote(
			customerId: $customerId
			customer: $customer
			template: $template
			option: $option
			name: $name
		) {
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
`;
export const UPDATE_QUOTE = gql`
	# creating quote with a customer id or a new customer
	mutation updateQuote($quoteId: ID!, $name: String!) {
		updateQuote(id: $quoteId, name: $name) {
			id
			name
		}
	}
`;
export const SEND_QUOTE = gql`
	# creating quote with a customer id or a new customer
	mutation sendQuote($quoteId: ID!) {
		sendQuote(id: $quoteId) {
			id
			status
			viewedByCustomer
		}
	}
`;

export const REMOVE_QUOTE = gql`
	mutation removeQuote($quoteId: ID!) {
		removeQuote(id: $quoteId) {
			id
		}
	}
`;

export const ACCEPT_QUOTE = gql`
	# creating quote with a customer id or a new customer
	mutation acceptQuote($quoteId: ID!, $token: String!) {
		acceptQuote(id: $quoteId, token: $token) {
			id
			status
		}
	}
`;

export const REJECT_QUOTE = gql`
	# creating quote with a customer id or a new customer
	mutation rejectQuote($quoteId: ID!, $token: String!) {
		rejectQuote(id: $quoteId, token: $token) {
			id
			status
		}
	}
`;
// Option
export const UPDATE_OPTION = gql`
	mutation updateOption($optionId: ID!, $proposal: Json!) {
		updateOption(id: $optionId, proposal: $proposal) {
			id
			proposal
		}
	}
`;
// Section
export const ADD_SECTION = gql`
	mutation addSection($optionId: ID!, $name: String!, $items: [ItemInput!]) {
		addSection(optionId: $optionId, name: $name, items: $items) {
			id
			name
			items {
				id
				name
				unitPrice
				unit
				vatRate
				description
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
				id
				name
				unitPrice
				unit
				vatRate
				description
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
		$unitPrice: Int
		$unit: Float
		$vatRate: Int
		$description: String
	) {
		addItem(
			sectionId: $sectionId
			name: $name
			unitPrice: $unitPrice
			unit: $unit
			vatRate: $vatRate
			description: $description
		) {
			id
			name
			unitPrice
			unit
			vatRate
			description
			pendingUnit
			status
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
		$unitPrice: Int
		$unit: Float
		$vatRate: Int
	) {
		updateItem(
			id: $itemId
			name: $name
			description: $description
			unitPrice: $unitPrice
			unit: $unit
			vatRate: $vatRate
		) {
			id
			name
			unitPrice
			unit
			vatRate
			description
			pendingUnit
			status
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

export const UPDATE_VALIDATED_ITEM = gql`
	# update an item that is in a VALIDATED quote
	# the item status is passed to UPDATED
	# and pendingUnit is filled with the value passed
	mutation updateValidatedItem(
		$itemId: ID!
		$unit: Float!
		$comment: CommentInput!
	) {
		updateValidatedItem(id: $itemId, unit: $unit, comment: $comment) {
			id
			name
			unitPrice
			unit
			vatRate
			description
			pendingUnit
			status
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
	mutation finishItem($itemId: ID!) {
		finishItem(id: $itemId) {
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

export const SEND_AMENDMENT = gql`
	mutation sendAmendment($quoteId: ID!) {
		sendAmendment(quoteId: $quoteId) {
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
			options {
				id
				name
				proposal
				sections {
					id
					name
					items {
						status
						id
						name
						unitPrice
						unit
						pendingUnit
						vatRate
						description
					}
				}
			}
		}
	}
`;

export const ACCEPT_AMENDMENT = gql`
	mutation acceptAmendment($quoteId: ID!, $token: String!) {
		acceptAmendment(quoteId: $quoteId, token: $token) {
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
			options {
				id
				name
				proposal
				sections {
					id
					name
					items {
						status
						id
						name
						unitPrice
						unit
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
	}
`;

export const REJECT_AMENDMENT = gql`
	mutation rejectAmendment($quoteId: ID!, $token: String!) {
		rejectAmendment(quoteId: $quoteId, token: $token) {
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
			options {
				id
				name
				proposal
				sections {
					id
					name
					items {
						status
						id
						name
						unitPrice
						unit
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
