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
	mutation createQuote($customerId: ID, $customer: CustomerInput) {
		createQuote(customerId: $customerId, customer: $customer) {
			id
		}
	}
`;
export const UPDATE_QUOTE = gql`
	# creating quote with a customer id or a new customer
	mutation updateQuote($quoteId: ID, $name: String!) {
		updateQuote(quoteId: $quoteId, name: $name) {
			id
		}
	}
`;
// Option
export const CREATE_OPTION = gql`
	mutation createOption($quoteId: ID, $name: String!, $proposal: String) {
		createOption(quoteId: $quoteId, name: $name, proposal: $proposal) {
			id
		}
	}
`;
export const UPDATE_OPTION = gql`
	mutation updateOption($optionId: ID, $name: String!, $option: OptionInput) {
		updateOption(optionId: $optionId, name: $name, option: $option) {
			id
			options {
				id
			}
		}
	}
`;
// Section
export const ADD_SECTION = gql`
	mutation addSection($optionId: ID, $name: String!, $items: [ItemInput!]) {
		addSection(optionId: $optionId, name: $name, items: $items) {
			id
			items {
				id
			}
		}
	}
`;
export const REMOVE_SECTION = gql`
	mutation removeSection($sectionId: ID) {
		removeSection(sectionId: $sectionId) {
			id
		}
	}
`;
// Item
export const ADD_ITEM = gql`
	mutation addSection($sectionId: ID, $item: ItemInput!) {
		addSection(sectionId: $sectionId, item: $item) {
			id
		}
	}
`;
export const REMOVE_ITEM = gql`
	mutation removeSection($itemId: ID) {
		removeSection(itemId: $itemId) {
			id
		}
	}
`;
