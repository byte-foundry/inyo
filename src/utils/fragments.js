import gql from 'graphql-tag';

export const SHORT_TAG_FRAGMENT = gql`
	fragment ShortTagFragment on Tag {
		id
		name
		colorBg
		colorText
	}
`;

export const SHORT_TASK_FRAGMENT = gql`
	${SHORT_TAG_FRAGMENT}

	fragment ShortTaskFragment on Item {
		id
		description
		dueDate
		name
		position
		status
		finishedAt
		createdAt
		type
		unit
		timeItTook
		isFocused
		scheduledFor
		schedulePosition
		owner {
			id
		}
		assignee {
			id
			email
			firstName
			lastName
		}
		attachments {
			id
		}
		linkedCustomer {
			id
			name
			firstName
			lastName
		}

		tags {
			...ShortTagFragment
		}

		section {
			id
			project {
				id
				name
				deadline
				status
			}
		}

		comments {
			id
		}
	}
`;

export const TAG_FRAGMENT = gql`
	fragment TagFragment on Tag {
		id
		name
		colorBg
		colorText
		items {
			id
		}
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
				firstName
				lastName
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
		finishedAt
		createdAt
		type
		unit
		timeItTook
		isFocused
		scheduledFor
		schedulePosition
		owner {
			id
		}
		assignee {
			id
			email
			firstName
			lastName
		}
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
			firstName
			lastName
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
				linkedCollaborators {
					id
					email
					firstName
					lastName
				}
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
