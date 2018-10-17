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
	) {
		createQuote(
			customerId: $customerId
			customer: $customer
			template: $template
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
// Option
export const UPDATE_OPTION = gql`
	mutation updateOption($optionId: ID!, $proposal: String!) {
		updateOption(optionId: $optionId, proposal: $proposal) {
			id
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
				pendingUnitPrice
				pendingUnitPrice
				unit
				vatRate
			}
		}
	}
`;
export const UPDATE_SECTION = gql`
	mutation updateSection($sectionId: ID!, $name: String!) {
		updateSection(sectionId: $sectionId, name: $name) {
			id
			name
			items {
				id
				name
				pendingUnitPrice
				pendingUnitPrice
				unit
				vatRate
			}
		}
	}
`;
export const REMOVE_SECTION = gql`
	mutation removeSection($sectionId: ID!) {
		removeSection(sectionId: $sectionId) {
			id
		}
	}
`;
// Item
export const ADD_ITEM = gql`
	mutation addItem($itemId: ID!, $item: ItemInput!) {
		addItem(itemId: $itemId, item: $item) {
			id
			name
			pendingUnitPrice
			pendingUnitPrice
			unit
			vatRate
		}
	}
`;
export const UPDATE_ITEM = gql`
	mutation updateItem($itemId: ID!, $item: ItemInput!) {
		updateItem(itemId: $itemId, item: $item) {
			id
			name
			pendingUnitPrice
			pendingUnitPrice
			unit
			vatRate
		}
	}
`;
export const REMOVE_ITEM = gql`
	mutation removeItem($itemId: ID!) {
		removeItem(itemId: $itemId) {
			id
		}
	}
`;
