import gql from 'graphql-tag';

export const ITEM_FRAGMENT = gql`
	fragment ItemFragment on Item {
		id
		description
		dueDate
		name
		position
		status
		type
		unit
		timeItTook
		attachments {
			id
			filename
			url
			owner {
				__typename
				... on User {
					firstName
					lastName
				}
				... on Customer {
					firstName
					lastName
				}
			}
		}
		linkedCustomer {
			id
			name
		}

		section {
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
		}

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
`;

export const PROJECT_CUSTOMER_FRAGMENT = gql`
	fragment ProjectCustomerFragment on Customer {
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
`;
