import gql from 'graphql-tag';

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
		$firstName: String
		$lastName: String
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

/** ******** COMPANY MUTATIONS ********* */

export const UPDATE_USER_COMPANY = gql`
	mutation UpdateUserCompany($todo: String) {
		updateCompany(todo: $todo) {
			id
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
	) {
		createQuote(
			customerId: $customerId
			customer: $customer
			template: $template
			option: $option
		) {
			id
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
	mutation addItem($sectionId: ID!, $name: String!) {
		addItem(sectionId: $sectionId, name: $name) {
			id
			name
			unitPrice
			unit
			vatRate
			description
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
		}
	}
`;

export const UPDATE_VALIDATED_ITEM = gql`
	mutation updateValidatedItem(
		$itemId: ID!
		$unit: Float!
		$comment: CommentInput!
	) {
		updateValidatedItem(id: $itemId, unit: $unit, comment: $comment) {
			id
			unit
			pendingUnit
			status
			comments {
				text
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

export const REMOVE_ITEM = gql`
	mutation removeItem($itemId: ID!) {
		removeItem(id: $itemId) {
			id
		}
	}
`;
