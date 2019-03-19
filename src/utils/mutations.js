import gql from 'graphql-tag'; // eslint-disable-line import/no-extraneous-dependencies

import {ITEM_FRAGMENT, PROJECT_CUSTOMER_FRAGMENT} from './fragments';

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
			defaultDailyPrice
			defaultVatRate
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
			settings {
				askItemFinishConfirmation
				askStartProjectConfirmation
			}
		}
	}
`;

export const UPDATE_USER_CONSTANTS = gql`
	mutation updateUserConstant(
		$defaultDailyPrice: Int
		$defaultVatRate: Int
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
	) {
		updateUser(
			defaultDailyPrice: $defaultDailyPrice
			defaultVatRate: $defaultVatRate
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
		) {
			id
			email
			firstName
			lastName
			defaultDailyPrice
			defaultVatRate
			workingFields
			jobType
			interestedFeatures
			hasUpcomingProject
			startWorkAt
			endWorkAt
			workingDays
			timeZone
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
				askItemFinishConfirmation
				askStartProjectConfirmation
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
			defaultDailyPrice
			defaultVatRate
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
				askItemFinishConfirmation
				askStartProjectConfirmation
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
			defaultDailyPrice
			defaultVatRate
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
				askItemFinishConfirmation
				askStartProjectConfirmation
			}
		}
	}
`;

/** ******** PROJECT MUTATIONS ********* */

export const CREATE_PROJECT = gql`
	${PROJECT_CUSTOMER_FRAGMENT}

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
		}
	}
`;
export const UPDATE_PROJECT = gql`
	${PROJECT_CUSTOMER_FRAGMENT}

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
			customer {
				...ProjectCustomerFragment
			}
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

export const REMOVE_PROJECT = gql`
	mutation removeProject($projectId: ID!) {
		removeProject(id: $projectId) {
			id
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

export const SEND_AMENDMENT = gql`
	mutation sendAmendment($projectId: ID!) {
		sendAmendment(projectId: $projectId) {
			id
			template
			name
			viewedByCustomer
			status
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
					defaultVatRate
				}
				siret
			}
			customer {
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
					status
					id
					name
					unit
					description
				}
			}
		}
	}
`;

export const ACCEPT_AMENDMENT = gql`
	mutation acceptAmendment($projectId: ID!, $token: String!) {
		acceptAmendment(projectId: $projectId, token: $token) {
			id
			template
			name
			status
			issuer {
				name
				email
				address {
					street
					city
					postalCode
					country
				}
				owner {
					defaultVatRate
				}
				siret
			}
			customer {
				name
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
					status
					id
					name
					unit
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
					description
				}
			}
		}
	}
`;

export const REJECT_AMENDMENT = gql`
	mutation rejectAmendment($projectId: ID!, $token: String!) {
		rejectAmendment(projectId: $projectId, token: $token) {
			id
			template
			name
			status
			issuer {
				name
				email
				address {
					street
					city
					postalCode
					country
				}
				owner {
					defaultVatRate
				}
				siret
			}
			customer {
				name
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
					status
					id
					name
					unit
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
					description
				}
			}
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
	) {
		createCustomer(
			email: $email
			name: $name
			firstName: $firstName
			lastName: $lastName
			title: $title
		) {
			id
			title
			firstName
			lastName
			name
			email
			phone
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
	) {
		updateCustomer(
			id: $id
			title: $title
			name: $name
			firstName: $firstName
			lastName: $lastName
			email: $email
			phone: $phone
		) {
			id
			title
			firstName
			lastName
			name
			email
			phone
		}
	}
`;

export const UPLOAD_ATTACHMENTS = gql`
	mutation uploadAttachments(
		$taskId: ID
		$projectId: ID
		$files: [Upload!]!
	) {
		uploadAttachments(
			files: $files
			taskId: $taskId
			projectId: $projectId
		) {
			id
			filename
			url
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
		id
	}
`;
