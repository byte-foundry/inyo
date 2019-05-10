import gql from 'graphql-tag';

export const TAG_FRAGMENT = gql`
	fragment TagFragment on Tag {
		id
		name
		colorBg
		colorText
	}
`;

export const REMINDER_FRAGMENT = gql`
	fragment ReminderFragment on Reminder {
		id
		type
		sendingDate
		status
		item {
			id
			name
			linkedCustomer {
				id
				name
			}
		}
	}
`;

export const COMMENT_ON_ITEM_FRAGMENT = gql`
	fragment CommentOnItemFragment on Comment {
		createdAt
		text
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
`;

export const ITEM_FRAGMENT = gql`
	${COMMENT_ON_ITEM_FRAGMENT}
	${REMINDER_FRAGMENT}
	${TAG_FRAGMENT}

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
		isFocused
		reminders {
			...ReminderFragment
		}
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

		tags {
			...TagFragment
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
			...CommentOnItemFragment
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
		token
		address {
			street
			city
			postalCode
			country
		}
	}
`;
