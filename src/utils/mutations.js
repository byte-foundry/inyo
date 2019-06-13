import gql from 'graphql-tag'; // eslint-disable-line import/no-extraneous-dependencies

import {
	ITEM_FRAGMENT,
	PROJECT_CUSTOMER_FRAGMENT,
	REMINDER_FRAGMENT,
	TAG_FRAGMENT,
} from './fragments';

/** ******** USER GENERIC MUTATIONS ********* */
export const LOGIN = gql`
	mutation login($email: String!, $password: String!) {
		login(email: $email, password: $password) {
			token
			user {
				id
				email
				hmacIntercomId
				firstName
				lastName
				workingDays
				startWorkAt
				endWorkAt
				timeZone
				company {
					phone
				}
			}
		}
	}
`;

export const SIGNUP = gql`
	mutation signup(
		$email: String!
		$password: String!
		$firstName: String!
		$lastName: String!
		$referrer: String
	) {
		signup(
			email: $email
			password: $password
			firstName: $firstName
			lastName: $lastName
			referrer: $referrer
		) {
			token
			user {
				id
				email
				hmacIntercomId
				firstName
				lastName
				company {
					phone
				}
			}
		}
	}
`;

export const UPDATE_USER = gql`
	mutation updateUser($firstName: String, $lastName: String, $email: String) {
		updateUser(firstName: $firstName, lastName: $lastName, email: $email) {
			id
			email
			firstName
			lastName
			startWorkAt
			endWorkAt
			workingDays
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
		}
	}
`;

export const UPDATE_USER_CONSTANTS = gql`
	mutation updateUserConstant(
		$workingFields: [String!]
		$jobType: JobType
		$interestedFeatures: [String!]
		$hasUpcomingProject: Boolean
		$canBeContacted: Boolean
		$otherPain: String
		$painsExpressed: [String!]
		$startWorkAt: Time
		$endWorkAt: Time
		$company: CompanyInput
		$workingDays: [DAY!]
		$timeZone: TimeZone
		$hasFullWeekSchedule: Boolean
	) {
		updateUser(
			workingFields: $workingFields
			jobType: $jobType
			interestedFeatures: $interestedFeatures
			hasUpcomingProject: $hasUpcomingProject
			canBeContacted: $canBeContacted
			otherPain: $otherPain
			painsExpressed: $painsExpressed
			company: $company
			startWorkAt: $startWorkAt
			endWorkAt: $endWorkAt
			workingDays: $workingDays
			timeZone: $timeZone
			settings: {hasFullWeekSchedule: $hasFullWeekSchedule}
		) {
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
			timeZone
			settings {
				hasFullWeekSchedule
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
		}
	}
`;

// Update User settings
export const UPDATE_USER_SETTINGS = gql`
	mutation updateUserSettings($settings: SettingsInput!) {
		updateUser(settings: $settings) {
			id
			email
			firstName
			lastName
			workingFields
			jobType
			interestedFeatures
			hasUpcomingProject
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
			}
		}
	}
`;
/** ******** COMPANY MUTATIONS ********* */

export const UPDATE_USER_COMPANY = gql`
	mutation updateUserCompany($company: CompanyInput) {
		updateUser(company: $company) {
			id
			email
			firstName
			lastName
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
		}
	}
`;

/** ******** PROJECT MUTATIONS ********* */

export const CREATE_PROJECT = gql`
	${PROJECT_CUSTOMER_FRAGMENT}
	${ITEM_FRAGMENT}

	# creating project with a customer id or a new customer
	mutation createProject(
		$customerId: ID
		$name: String
		$customer: CustomerInput
		$template: ProjectTemplate
		$sections: [SectionInput!]
		$deadline: DateTime
		$notifyActivityToCustomer: Boolean
	) {
		createProject(
			customerId: $customerId
			customer: $customer
			template: $template
			sections: $sections
			name: $name
			deadline: $deadline
			notifyActivityToCustomer: $notifyActivityToCustomer
		) {
			id
			name
			viewedByCustomer
			deadline
			daysUntilDeadline
			customer {
				...ProjectCustomerFragment
			}
			issuedAt
			createdAt
			status
			total
			sections {
				id
				items {
					...ItemFragment
				}
			}
		}
	}
`;
export const UPDATE_PROJECT = gql`
	${PROJECT_CUSTOMER_FRAGMENT}
	${ITEM_FRAGMENT}

	# creating project with a customer id or a new customer
	mutation updateProject(
		$projectId: ID!
		$name: String
		$deadline: DateTime
		$notifyActivityToCustomer: Boolean
		$customerId: ID
		$customer: CustomerInput
	) {
		updateProject(
			id: $projectId
			name: $name
			deadline: $deadline
			notifyActivityToCustomer: $notifyActivityToCustomer
			customerId: $customerId
			customer: $customer
		) {
			id
			name
			deadline
			daysUntilDeadline
			notifyActivityToCustomer
			status
			customer {
				...ProjectCustomerFragment
			}
			sections {
				id
				items {
					...ItemFragment
				}
			}
		}
	}
`;

export const UPDATE_PROJECT_PERSONAL_NOTES = gql`
	mutation updateProject($id: ID!, $notes: Json) {
		updateProject(id: $id, personalNotes: $notes) {
			id
			personalNotes
		}
	}
`;

export const UPDATE_PROJECT_SHARED_NOTES = gql`
	mutation updateProject($id: ID!, $notes: Json) {
		updateProject(id: $id, sharedNotes: $notes) {
			id
			sharedNotes
		}
	}
`;

export const START_PROJECT = gql`
	# creating project with a customer id or a new customer
	mutation startProject($projectId: ID!, $notifyCustomer: Boolean) {
		startProject(id: $projectId, notifyCustomer: $notifyCustomer) {
			id
			status
			viewedByCustomer
		}
	}
`;

export const ARCHIVE_PROJECT = gql`
	${PROJECT_CUSTOMER_FRAGMENT}
	${ITEM_FRAGMENT}

	mutation archiveProject($projectId: ID!) {
		archiveProject(id: $projectId) {
			id
			name
			deadline
			daysUntilDeadline
			status
			notifyActivityToCustomer
			customer {
				...ProjectCustomerFragment
			}
			sections {
				id
				items {
					id
					...ItemFragment
				}
			}
		}
	}
`;

export const UNARCHIVE_PROJECT = gql`
	${PROJECT_CUSTOMER_FRAGMENT}
	${ITEM_FRAGMENT}

	mutation unarchiveProject($projectId: ID!) {
		unarchiveProject(id: $projectId) {
			id
			name
			deadline
			daysUntilDeadline
			notifyActivityToCustomer
			status
			customer {
				...ProjectCustomerFragment
			}
			sections {
				id
				items {
					id
					...ItemFragment
				}
			}
		}
	}
`;

export const REMOVE_PROJECT = gql`
	${PROJECT_CUSTOMER_FRAGMENT}
	${ITEM_FRAGMENT}

	mutation removeProject($projectId: ID!) {
		removeProject(id: $projectId) {
			id
			name
			deadline
			daysUntilDeadline
			notifyActivityToCustomer
			status
			customer {
				...ProjectCustomerFragment
			}
			sections {
				id
				items {
					id
					...ItemFragment
				}
			}
		}
	}
`;

export const UNREMOVE_PROJECT = gql`
	${PROJECT_CUSTOMER_FRAGMENT}
	${ITEM_FRAGMENT}

	mutation unremoveProject($projectId: ID!) {
		unremoveProject(id: $projectId) {
			id
			name
			deadline
			daysUntilDeadline
			notifyActivityToCustomer
			status
			customer {
				...ProjectCustomerFragment
			}
			sections {
				id
				items {
					id
					...ItemFragment
				}
			}
		}
	}
`;

export const FINISH_PROJECT = gql`
	mutation finishProject($projectId: ID!) {
		finishProject(id: $projectId) {
			id
			status
		}
	}
`;

// Section
export const ADD_SECTION = gql`
	${ITEM_FRAGMENT}

	mutation addSection(
		$projectId: ID!
		$name: String!
		$items: [ItemInput!]
		$position: Int
	) {
		addSection(
			projectId: $projectId
			name: $name
			items: $items
			position: $position
		) {
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
`;
export const UPDATE_SECTION = gql`
	${ITEM_FRAGMENT}

	mutation updateSection($sectionId: ID!, $name: String, $position: Int) {
		updateSection(id: $sectionId, name: $name, position: $position) {
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
	${ITEM_FRAGMENT}

	mutation addItem(
		$sectionId: ID
		$projectId: ID
		$name: String!
		$type: ItemType
		$unit: Float
		$description: String
		$dueDate: DateTime
		$linkedCustomerId: ID
		$linkedCustomer: CustomerInput
	) {
		addItem(
			sectionId: $sectionId
			projectId: $projectId
			name: $name
			type: $type
			unit: $unit
			description: $description
			dueDate: $dueDate
			linkedCustomerId: $linkedCustomerId
			linkedCustomer: $linkedCustomer
		) {
			...ItemFragment
		}
	}
`;
export const UPDATE_ITEM = gql`
	${ITEM_FRAGMENT}

	mutation updateItem(
		$itemId: ID!
		$comment: CommentInput
		$description: String
		$dueDate: DateTime
		$linkedCustomerId: ID
		$linkedCustomer: CustomerInput
		$name: String
		$position: Int
		$sectionId: ID
		$projectId: ID
		$token: String
		$type: ItemType
		$unit: Float
		$timeItTook: Float
		$tags: [ID!]
	) {
		updateItem(
			id: $itemId
			comment: $comment
			description: $description
			dueDate: $dueDate
			linkedCustomerId: $linkedCustomerId
			linkedCustomer: $linkedCustomer
			name: $name
			position: $position
			sectionId: $sectionId
			projectId: $projectId
			token: $token
			type: $type
			unit: $unit
			timeItTook: $timeItTook
			tags: $tags
		) {
			...ItemFragment
		}
	}
`;

export const FINISH_ITEM = gql`
	${ITEM_FRAGMENT}

	mutation finishItem($itemId: ID!, $token: String, $timeItTook: Float) {
		finishItem(id: $itemId, token: $token, timeItTook: $timeItTook) {
			...ItemFragment
		}
	}
`;

export const UNFINISH_ITEM = gql`
	${ITEM_FRAGMENT}

	mutation unfinishItem($itemId: ID!) {
		unfinishItem(id: $itemId) {
			...ItemFragment
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

export const SNOOZE_ITEM = gql`
	${ITEM_FRAGMENT}

	mutation snoozeItem($itemId: ID!, $during: Int) {
		snoozeItem(id: $itemId, during: $during) {
			...ItemFragment
		}
	}
`;

export const FOCUS_TASK = gql`
	${ITEM_FRAGMENT}

	mutation focusTask(
		$itemId: ID!
		$reminders: [ReminderInput]
		$for: Date
		$schedulePosition: Int
	) {
		focusTask(
			id: $itemId
			reminders: $reminders
			for: $for
			schedulePosition: $schedulePosition
		) {
			...ItemFragment
		}
	}
`;

export const UNFOCUS_TASK = gql`
	${ITEM_FRAGMENT}

	mutation unfocusTask($itemId: ID!) {
		unfocusTask(id: $itemId) {
			...ItemFragment
		}
	}
`;

export const ACCEPT_ITEM = gql`
	mutation acceptItem($itemId: ID!, $token: String!) {
		acceptItem(id: $itemId, token: $token) {
			id
			status
			unit
		}
	}
`;

export const REJECT_ITEM = gql`
	mutation rejectItem($itemId: ID!, $token: String!) {
		rejectItem(id: $itemId, token: $token) {
			id
			status
			unit
		}
	}
`;

export const POST_COMMENT = gql`
	mutation postComment(
		$itemId: ID!
		$token: String
		$comment: CommentInput!
	) {
		postComment(itemId: $itemId, token: $token, comment: $comment) {
			id
			comments {
				createdAt
				id
				text
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
	}
`;

export const CHECK_UNIQUE_EMAIL = gql`
	mutation checkEmailAvailability($email: String!) {
		isAvailable: checkEmailAvailability(email: $email)
	}
`;

export const CREATE_CUSTOMER = gql`
	mutation createCustomer(
		$email: String!
		$name: String
		$firstName: String
		$lastName: String
		$title: Title
		$phone: String
		$occupation: String
		$userNotes: Json
	) {
		createCustomer(
			email: $email
			name: $name
			firstName: $firstName
			lastName: $lastName
			title: $title
			phone: $phone
			occupation: $occupation
			userNotes: $userNotes
		) {
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
`;

export const UPDATE_CUSTOMER = gql`
	mutation updateCustomer(
		$id: ID!
		$email: String!
		$name: String!
		$firstName: String
		$lastName: String
		$title: Title
		$phone: String
		$occupation: String
		$userNotes: Json
	) {
		updateCustomer(
			id: $id
			title: $title
			name: $name
			firstName: $firstName
			lastName: $lastName
			email: $email
			phone: $phone
			occupation: $occupation
			userNotes: $userNotes
		) {
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
`;

export const UPLOAD_ATTACHMENTS = gql`
	mutation uploadAttachments(
		$token: String
		$taskId: ID
		$projectId: ID
		$files: [Upload!]!
	) {
		uploadAttachments(
			token: $token
			files: $files
			taskId: $taskId
			projectId: $projectId
		) {
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
	}
`;

export const REMOVE_ATTACHMENTS = gql`
	mutation removeAttachment($attachmentId: ID!) {
		removeFile(id: $attachmentId) {
			id
		}
	}
`;

export const REMOVE_CUSTOMER = gql`
	mutation removeCustomer($id: ID!) {
		removeCustomer(id: $id) {
			id
		}
	}
`;

export const CANCEL_REMINDER = gql`
	${REMINDER_FRAGMENT}

	mutation cancelReminder($id: ID!) {
		cancelReminder(id: $id) {
			...ReminderFragment
		}
	}
`;

export const SEND_REMINDER_TEST_EMAIL = gql`
	mutation sendReminderTestEmail($id: ID!) {
		sent: sendReminderTestEmail(id: $id)
	}
`;

export const SEND_REMINDER_PREVIEW_TEST_EMAIL = gql`
	mutation sendReminderPreviewTestEmail($taskId: ID!, $type: ReminderType!) {
		sent: sendReminderPreviewTestEmail(taskId: $taskId, type: $type)
	}
`;

export const MARK_NOTIFICATIONS_AS_READ = gql`
	mutation markNotificationsAsRead {
		marked: markNotificationsAsRead
	}
`;

export const CREATE_TAG = gql`
	${TAG_FRAGMENT}

	mutation createTag($name: String!, $colorBg: String!, $colorText: String!) {
		createTag(name: $name, colorBg: $colorBg, colorText: $colorText) {
			...TagFragment
		}
	}
`;

export const UPDATE_TAG = gql`
	${TAG_FRAGMENT}

	mutation updateTag(
		$id: ID!
		$name: String
		$colorBg: String
		$colorText: String
	) {
		updateTag(
			id: $id
			name: $name
			colorBg: $colorBg
			colorText: $colorText
		) {
			...TagFragment
		}
	}
`;

export const REMOVE_TAG = gql`
	mutation removeTag($id: ID!) {
		removeTag(id: $id) {
			id
		}
	}
`;
