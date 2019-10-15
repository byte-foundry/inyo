import gql from 'graphql-tag';

import {
	COMMENT_ON_ITEM_FRAGMENT,
	ITEM_FRAGMENT,
	PROJECT_CUSTOMER_FRAGMENT,
	REMINDER_FRAGMENT,
	SHORT_TASK_FRAGMENT,
	TAG_FRAGMENT,
} from './fragments';

/** ******** USER QUERIES ********* */
export const CHECK_LOGIN_USER = gql`
	query loggedInUserQuery {
		me {
			email
			id
			hmacIntercomId
			firstName
			lastName
			company {
				phone
			}
			settings {
				language
			}
		}
	}
`;

export const GET_USER_CUSTOMERS = gql`
	query getUserCustomers {
		me {
			id
			customers {
				id
				title
				firstName
				lastName
				name
				email
				phone
				occupation
				userNotes
			}
		}
	}
`;

export const GET_USER_COLLABORATORS = gql`
	query getUserCollaboratorsAndRequests {
		me {
			id
			collaborators {
				id
				firstName
				lastName
				email
			}
			collaboratorRequests {
				id
				requestee {
					id
					firstName
					lastName
					email
				}
				requesteeEmail
				status
			}
			collaborationRequests {
				id
				requester {
					id
					firstName
					lastName
					email
				}
				status
			}
		}
	}
`;

export const GET_USER_INFOS = gql`
	${TAG_FRAGMENT}

	query userInfosQuery {
		me {
			id
			email
			firstName
			lastName
			workingFields
			jobType
			interestedFeatures
			hasUpcomingProject
			startWorkAt
			endWorkAt
			workingDays
			defaultDailyPrice
			clientViews
			timeZone
			tags {
				...TagFragment
			}
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
				phone
				siret
				rcs
				rm
				vat
			}
			settings {
				assistantName
				language
				hasFullWeekSchedule
			}
		}
	}
`;

export const GET_USER_PAYMENT_INFOS = gql`
	query userInfosQuery {
		me {
			id
			email
		}
	}
`;

export const GET_USER_TAGS = gql`
	${TAG_FRAGMENT}

	query getAllTags {
		me {
			id
			tags {
				...TagFragment
			}
		}
	}
`;

/** ******** PROJECT QUERIES ********* */

export const GET_ALL_PROJECTS = gql`
	query getAllProjects {
		me {
			id
			projects {
				id
				name
				viewedByCustomer
				customer {
					id
					name
				}
				sections {
					id
					items {
						id
						unit
						timeItTook
						status
					}
				}
				issuedAt
				createdAt
				status
				total
			}
		}
	}
`;

export const GET_PROJECT_NOTIFY_ACTIVITY = gql`
	query getProjectNotifyActivity($id: ID!) {
		project(id: $id) {
			id
			notifyActivityToCustomer
		}
	}
`;

export const GET_PROJECT_SHARED_NOTES = gql`
	query getProjectSharedNotes($id: ID!, $token: String) {
		project(id: $id, token: $token) {
			id
			sharedNotes
		}
	}
`;

export const GET_PROJECT_PERSONAL_NOTES = gql`
	query getProjectPersonalNotes($id: ID!) {
		project(id: $id) {
			id
			personalNotes
		}
	}
`;

export const GET_PROJECT_COLLAB_LINK = gql`
	query getProjectCollabLink($id: ID!) {
		project(id: $id) {
			id
			linkedCollaborators {
				id
				email
				firstName
				lastName
			}
		}
	}
`;

export const GET_PROJECT_INFOS = gql`
	${PROJECT_CUSTOMER_FRAGMENT}

	query getProjectInfos($projectId: ID!, $token: String) {
		project(id: $projectId, token: $token) {
			id
			template
			viewedByCustomer
			name
			status
			createdAt
			deadline
			daysUntilDeadline
			notifyActivityToCustomer
			total
			token
			budget
			attachments {
				id
				filename
				url
				owner {
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
			sections {
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
				items {
					id
					status
					unit
					timeItTook
					dailyRate
				}
			}
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
					firstName
					lastName
					email
				}
				siret
			}
			linkedCollaborators {
				id
				email
				firstName
				lastName
			}
			customer {
				...ProjectCustomerFragment
			}
		}
	}
`;

export const GET_PROJECT_DATA = gql`
	${ITEM_FRAGMENT}

	query getProjectData($projectId: ID!) {
		project(id: $projectId) {
			id
			template
			viewedByCustomer
			name
			status
			createdAt
			deadline
			budget
			daysUntilDeadline
			notifyActivityToCustomer
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
					firstName
					lastName
					email
				}
				siret
			}
			customer {
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
			sections {
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
				items {
					...ItemFragment
				}
			}
		}
	}
`;

export const GET_PROJECT_DATA_WITH_TOKEN = gql`
	${ITEM_FRAGMENT}

	query getProjectDataWithToken($projectId: ID!, $token: String) {
		project(id: $projectId, token: $token) {
			id
			template
			name
			status
			deadline
			daysUntilDeadline
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
					firstName
					lastName
					email
				}
				siret
			}
			customer {
				id
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
			sections {
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
				items {
					...ItemFragment
				}
			}
		}
	}
`;

/** ******** COMMENT QUERIES ********* */
export const GET_COMMENTS_BY_ITEM = gql`
	${COMMENT_ON_ITEM_FRAGMENT}

	query getCommentsFromItemId(
		$itemId: ID!
		$token: String
		$updateCommentViews: Boolean
	) {
		item(
			id: $itemId
			token: $token
			updateCommentViews: $updateCommentViews
		) {
			id
			comments {
				...CommentOnItemFragment
			}
		}
	}
`;

export const GET_ITEM_DETAILS = gql`
	${ITEM_FRAGMENT}

	query getItemDetails($id: ID!, $token: String) {
		item(id: $id, token: $token) {
			...ItemFragment
			remindersPreviews {
				type
				delay
			}
		}
	}
`;

export const GET_ALL_TASKS_SHORT = gql`
	${SHORT_TASK_FRAGMENT}

	query getAllTasksShort(
		$linkedCustomerId: ID
		$first: Int
		$after: ID
		$schedule: ScheduleFilterInput
	) {
		me {
			id
			tasks(
				filter: {linkedCustomerId: $linkedCustomerId}
				schedule: $schedule
				first: $first
				after: $after
			) {
				...ShortTaskFragment
			}
		}
	}
`;

export const GET_ALL_TASKS = gql`
	${ITEM_FRAGMENT}

	query getAllTasks(
		$linkedCustomerId: ID
		$first: Int
		$after: ID
		$schedule: ScheduleFilterInput
	) {
		me {
			id
			tasks(
				filter: {linkedCustomerId: $linkedCustomerId}
				schedule: $schedule
				first: $first
				after: $after
			) {
				...ItemFragment
			}
		}
	}
`;

export const GET_SCHEDULE = gql`
	${ITEM_FRAGMENT}

	query getSchedule($start: Date) {
		me {
			id
			schedule(start: $start, first: 7) {
				date
				tasks {
					...ItemFragment
				}
				reminders {
					id
					status
					sendingDate
					item {
						id
						name
					}
				}
				deadlines {
					... on Project {
						id
						deadline
						projectStatus: status
						name
					}
					... on Item {
						id
						name
					}
				}
			}
		}
	}
`;

export const GET_CUSTOMER_TASKS = gql`
	${ITEM_FRAGMENT}

	query getCustomerTasks($token: String, $projectId: ID) {
		tasks(token: $token, projectId: $projectId) {
			...ItemFragment
		}
	}
`;

export const GET_ALL_CUSTOMERS = gql`
	query getAllCustomers {
		me {
			id
			customers {
				id
				name
				firstName
				lastName
			}
		}
	}
`;

export const USER_TASKS = gql`
	${ITEM_FRAGMENT}
	query userTasks {
		me {
			id
			startWorkAt
			endWorkAt
		}
		tasks {
			...ItemFragment
		}
	}
`;

export const GET_REMINDERS = gql`
	${REMINDER_FRAGMENT}

	query getReminders {
		reminders {
			...ReminderFragment
		}
	}
`;

export const GET_USER_NOTIFICATIONS = gql`
	query getUserNotifications {
		me {
			id
			notifications {
				id
				unread
				eventType
				from {
					... on User {
						id
						email
						firstName
						lastName
					}
					... on Customer {
						id
						title
						firstName
						lastName
					}
				}
				object {
					... on CollabRequest {
						id
						status
					}
					... on User {
						id
						email
						firstName
						lastName
					}
					... on Item {
						id
						name
					}
					... on Project {
						id
						name
					}
				}
				createdAt
			}
		}
	}
`;

export const GET_CUSTOMER_LANGUAGE = gql`
	query getCustomerLanguage($token: String) {
		customer(token: $token) {
			language
		}
	}
`;

export const GET_CUSTOMER_INFOS = gql`
	query getCustomerInfos($token: String) {
		customer(token: $token) {
			id
			name
			title
			firstName
			lastName
		}
	}
`;
