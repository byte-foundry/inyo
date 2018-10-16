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

export const EDIT_TASK_ITEMS = gql`
	mutation EditTaskItems($taskItems: [String!]!) {
		editTaskItems(taskItems: $taskItems) @client {
			taskItems
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
// Option
export const CREATE_OPTION = gql`
	# creating quote with a customer id or a new customer
	mutation createOption($quoteId: ID, $name: String!, $proposal: String) {
		createOption(quoteId: $quoteId, name: $name, proposal: $proposal) {
			id
		}
	}
`;
// Section
export const CREATE_SECTION = gql`
	# creating quote with a customer id or a new customer
	mutation createSection($optionId: ID, $name: String!) {
		createSection(optionId: $optionId, name: $name) {
			id
		}
	}
`;
// Task
export const CREATE_TASK = gql`
	# creating quote with a customer id or a new customer
	mutation createTask($sectionId: ID, $task: TaskInput) {
		createTask(sectionId: $sectionId, task: $task) {
			id
		}
	}
`;
