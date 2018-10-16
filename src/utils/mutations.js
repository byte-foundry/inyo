import gql from 'graphql-tag';

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

export const UPDATE_USER_COMPANY = gql`
	mutation UpdateUserCompany($todo: String) {
		updateCompany(todo: $todo) {
			id
		}
	}
`;

export const CREATE_CUSTOMER = gql`
	mutation CreateCustomer($todo: String) {
		createCustomer(todo: $todo) {
			id
		}
	}
`;

export const CREATE_QUOTE = gql`
	# creating quote with a customer id or a new customer
	mutation createQuote($customerId: ID, $customer: CustomerInput) {
		createQuote(customerId: $customerId, customer: $customer) {
			id
		}
	}
`;
