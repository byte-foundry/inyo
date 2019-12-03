import gql from "graphql-tag";

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
		scheduledFor
		schedulePosition
		dailyRate
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
		customer {
			id
			name
			firstName
			lastName
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
	${SHORT_TASK_FRAGMENT}

	fragment ItemFragment on Item {
		...ShortTaskFragment

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

		tags {
			...TagFragment
		}

		section {
			id
			name
			position
			project {
				id
				daysUntilDeadline
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

export const PROJECT_SHORT_FRAGMENT = gql`
	fragment ProjectShortFragment on Project {
		id
		template
		viewedByCustomer
		name
		status
		createdAt
		issuedAt
		deadline
		total
		budget
		daysUntilDeadline
		notifyActivityToCustomer
		token
	}
`;
