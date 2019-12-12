import React from 'react';

import fbt from '../fbt/fbt.macro';
import ContentAcquisitionIconUrl, {
	ReactComponent as ContentAcquisitionIcon,
} from './icons/content-acquisition.svg';
import TaskInvoiceIconUrl, {
	ReactComponent as TaskInvoiceIcon,
} from './icons/invoice-icon.svg';
import TaskCustomerIconValidatedAnimUrl from './icons/taskicon-customer-validated-anim.svg';
import TaskCustomerIconValidatedUrl, {
	ReactComponent as TaskCustomerIconValidated,
} from './icons/taskicon-customer-validated.svg';
import TaskCustomerIconUrl, {
	ReactComponent as TaskCustomerIcon,
} from './icons/taskicon-customer.svg';
import TaskIconPersonalUrl, {
	ReactComponent as TaskIconPersonal,
} from './icons/taskicon-personal.svg';
import TaskIconValidatedAnimUrl from './icons/taskicon-user-validated-anim.svg';
import TaskIconValidatedUrl, {
	ReactComponent as TaskIconValidated,
} from './icons/taskicon-user-validated.svg';
import TaskIconUrl, {ReactComponent as TaskIcon} from './icons/taskicon.svg';

export const GRAPHQL_API = process.env.REACT_APP_GRAPHQL_API
	? process.env.REACT_APP_GRAPHQL_API
	: `https://prisma${
		process.env.REACT_APP_INYO_ENV === 'development' ? '-dev' : ''
	  }.inyo.me/`;

export const INTERCOM_APP_ID
	= process.env.REACT_APP_INYO_ENV === 'development' ? 'cg8ntaar' : 'imlnj7st';

export const WEEKDAYS = {
	1: 'MONDAY',
	2: 'TUESDAY',
	3: 'WEDNESDAY',
	4: 'THURSDAY',
	5: 'FRIDAY',
	6: 'SATURDAY',
	0: 'SUNDAY',
};

export const itemStatuses = {
	FINISHED: 'FINISHED',
	PENDING: 'PENDING',
};

export const collabStatuses = {
	PENDING: 'PENDING',
	ACCEPTED: 'ACCEPTED',
	REJECTED: 'REJECTED',
	CANCELED: 'CANCELED',
};

export const BREAKPOINTS = {
	mobile: 480,
	desktopSmall: 1280,
};

export const CUSTOMER_TASK_TYPES = [
	'CUSTOMER',
	'CONTENT_ACQUISITION',
	'INVOICE',
];

export const MOMENT_DURATION_LOCALE_FR = {
	durationLabelsStandard: {
		d: 'jour',
		dd: 'jours',
	},
	durationTimeTemplates: {
		HM: 'h[h]mm',
	},
};

export const MOMENT_DURATION_LOCALE_EN = {
	durationLabelsStandard: {
		d: 'day',
		dd: 'days',
	},
	durationTimeTemplates: {
		HM: 'h:mm',
	},
};

// Any change here in the way item types are created is bound to affect
// TaskTypeDropDown filtering
export const ITEM_TYPES = [
	{
		icon: <TaskIcon />,
		iconValidated: <TaskIconValidated />,
		iconUrl: TaskIconUrl,
		iconUrlValidated: TaskIconValidatedUrl,
		iconUrlValidatedAnim: TaskIconValidatedAnimUrl,
		type: 'DEFAULT',
		get name() {
			return fbt('Basique', 'basic task name');
		},
		get description() {
			return fbt(
				'Une tâche dont vous êtes responsable',
				'basic task description',
			);
		},
	},
	{
		icon: <TaskIconPersonal />,
		iconValidated: <TaskIconValidated />,
		iconUrl: TaskIconPersonalUrl,
		iconUrlValidated: TaskIconValidatedUrl,
		iconUrlValidatedAnim: TaskIconValidatedAnimUrl,
		type: 'PERSONAL',
		get name() {
			return fbt('Tâche personnelle', 'personal task name');
		},
		get description() {
			return fbt(
				'Une tâche uniquement visible par vous',
				'personal task description',
			);
		},
	},
	{
		icon: <TaskCustomerIcon />,
		iconValidated: <TaskCustomerIconValidated />,
		iconUrl: TaskCustomerIconUrl,
		iconUrlValidated: TaskCustomerIconValidatedUrl,
		iconUrlValidatedAnim: TaskCustomerIconValidatedAnimUrl,
		type: 'CUSTOMER',
		get name() {
			return fbt('Tâche attribuée au client', 'customer task name');
		},
		get description() {
			return fbt(
				'Une tâche à réaliser par votre client',
				'customer task description',
			);
		},
	},
	{
		icon: <ContentAcquisitionIcon />,
		iconValidated: <TaskCustomerIconValidated />,
		iconUrl: ContentAcquisitionIconUrl,
		iconUrlValidated: TaskCustomerIconValidatedUrl,
		type: 'CONTENT_ACQUISITION',
		get name() {
			return fbt('Récupération contenu', 'content acquisition name');
		},
		get description() {
			return fbt(
				'Lister et récupérer les contenus nécessaires',
				'content acquisition description',
			);
		},
	},
	{
		icon: <TaskInvoiceIcon />,
		iconValidated: <TaskCustomerIconValidated />,
		iconUrl: TaskInvoiceIconUrl,
		iconUrlValidated: TaskCustomerIconValidatedUrl,
		type: 'INVOICE',
		get name() {
			return fbt('Paiement de facture', 'invoice task name');
		},
		get description() {
			return fbt(
				'Envoyer une facture et demander un paiement à votre client',
				'invoice task description',
			);
		},
	},
	/* {
		icon: <CustomerReminderIcon />,
		iconUrl: CustomerReminderIconUrl,
		type: 'CUSTOMER_REMINDER',
		name: 'Relance client générique',
		description: 'Programmer des relances client',
	},
	{
		icon: <ValidationIcon />,
		iconUrl: ValidationIconUrl,
		type: 'VALIDATION',
		name: 'Validation client',
		description: 'Demander à votre client une validation',
	},
	{
		icon: <UserReminderIcon />,
		iconUrl: UserReminderIconUrl,
		type: 'USER_REMINDER',
		name: 'Rappel personnel',
		description: 'Programmer un rappel (visible seulement par vous)',
	},
	{
		icon: '📝',
		type: 'MEETING_NOTES',
		name: 'Réunion client',
		description: 'Assembler et partager les notes de réunion',
	},
	{
		icon: '🌳',
		type: 'SUBTASKS',
		name: 'Tâche et sous-tâches',
		description: "Lister les sous-tâches d'une tâche parente",
	},
	{
		icon: '💰',
		type: 'PAYMENT',
		name: 'Paiement par le client',
		description: 'Demander et relancer pour un paiement',
	},
	{
		icon: '📆',
		type: 'SCHEDULE_MEETING',
		name: 'Programmation de RDV client',
		description: 'Programmer automatiquement une réunion',
	}, */
];
export const CATEGORY_NAMES = {
	CUSTOMER: {
		text: () => fbt('Tâche client', 'customer task'),
	},
	INVOICE: {
		text: () => fbt('Tâche paiement facture', 'invoice task'),
	},
	CONTENT_ACQUISITION: {
		text: () => fbt('Tâche récupération de contenu', 'content acquisition task'),
	},
	CUSTOMER_REPORT: {
		text: () => fbt('Rapport client', 'customer report'),
	},
	COMMENT_ADDED: {
		text: () => fbt('Commentaire ajouté', 'comment added'),
	},
};

export const LABEL_EMAIL_PARAM = {
	'task.name': {
		text: () => fbt('Nom de la tâche', 'first customer email'),
	},
	'task.description': {
		text: () => fbt('Description de la tâche', 'first reminder customer email'),
	},
	'task.link': {
		text: () => fbt('Lien vers la tâche', 'second reminder customer email'),
	},
	'task.attachments': {
		text: () => fbt('Fichiers joints a la tâche', 'third reminder customer email'),
	},
	'task.listOfAttachmentsNotUploaded': {
		text: () => fbt('Fichiers à uploader', 'first invoice email'),
	},
	'task.threadOfComments': {
		text: () => fbt('Fil des commentaires', 'first reminder invoice email'),
	},
	'project.name': {
		text: () => fbt('Nom du projet', 'second reminder invoice email'),
	},
	'project.deadline': {
		text: () => fbt('Deadline du projet', 'third reminder invoice email'),
	},
	'project.budget': {
		text: () => fbt('Budget du projet', 'fourth reminder invoice email'),
	},
	'project.link': {
		text: () => fbt('Lien vers le projet', 'fitfh reminder invoice email'),
	},
	'user.firstname': {
		text: () => fbt('Votre prénom', 'customer report email'),
	},
	'user.lastname': {
		text: () => fbt('Votre nom', 'comment added'),
	},
	'user.fullname': {
		text: () => fbt('Vos nom et prénom', 'comment added'),
	},
	'user.phone': {
		text: () => fbt('Votre téléphone', 'first customer email'),
	},
	'user.email': {
		text: () => fbt('Votre email', 'first reminder customer email'),
	},
	'user.listOfTasksCompleteOnDay': {
		text: () => fbt(
			"Tâches que vous avez complété aujourd'hui",
			'second reminder customer email',
		),
	},
	'customer.firstname': {
		text: () => fbt('Prénom du client', 'third reminder customer email'),
	},
	'customer.lastname': {
		text: () => fbt('Nom du client', 'first invoice email'),
	},
	'customer.fullname': {
		text: () => fbt(
			'Nom, prénom et civilité du client',
			'first reminder invoice email',
		),
	},
	'customer.phone': {
		text: () => fbt('Téléphone du client', 'second reminder invoice email'),
	},
	'customer.email': {
		text: () => fbt('Email du client', 'third reminder invoice email'),
	},
	'recipient.firstname': {
		text: () => fbt('Prénom du destinataire', 'fourth reminder invoice email'),
	},
	'recipient.lastname': {
		text: () => fbt('Nom du destinataire', 'fitfh reminder invoice email'),
	},
	'recipient.fullname': {
		text: () => fbt('Nom et prénom du destinataire', 'customer report email'),
	},
	'author.firstname': {
		text: () => fbt("Prénom de l'auteur", 'comment added'),
	},
	'author.lastname': {
		text: () => fbt("Nom de l'auteur", 'comment added'),
	},
	'author.fullname': {
		text: () => fbt("Nom et prénom de l'auteur", 'customer report email'),
	},
	'comment.text': {
		text: () => fbt('Texte du commentaire', 'comment added'),
	},
	'comment.createdAt': {
		text: () => fbt('Date du commentaire', 'comment added'),
	},
};

export const EMAIL_NAME_BY_TYPE = {
	DELAY: {
		text: () => fbt('Activation de la tâche', 'first customer email'),
	},
	FIRST: {
		text: () => fbt('1ère relance', 'first reminder customer email'),
	},
	SECOND: {
		text: () => fbt('2nde relance', 'second reminder customer email'),
	},
	LAST: {
		text: () => fbt('Dernière relance', 'third reminder customer email'),
	},
	INVOICE_DELAY: {
		text: () => fbt('Activation de la tâche', 'first invoice email'),
	},
	INVOICE_FIRST: {
		text: () => fbt('1ère relance', 'first reminder invoice email'),
	},
	INVOICE_SECOND: {
		text: () => fbt('2nde relance', 'second reminder invoice email'),
	},
	INVOICE_THIRD: {
		text: () => fbt('3e relance', 'third reminder invoice email'),
	},
	INVOICE_FOURTH: {
		text: () => fbt('4e relance', 'fourth reminder invoice email'),
	},
	INVOICE_LAST: {
		text: () => fbt('Dernière relance', 'fitfh reminder invoice email'),
	},
	CUSTOMER_REPORT: {
		text: () => fbt('Rapport client', 'customer report email'),
	},
	COMMENT_ADDED: {
		text: () => fbt('Commentaire ajouté', 'comment added'),
	},
};

export const REMINDER_TYPES_DATA = {
	DELAY: {
		text: customerName => fbt(
			`1er mail envoyé à ${fbt.param('customerName', customerName)}`,
			'first customer email',
		),
	},
	FIRST: {
		text: customerName => fbt(
			`Rappel nº1 envoyé à ${fbt.param(
				'customerName',
				customerName,
			)}`,
			'first reminder customer email',
		),
	},
	SECOND: {
		text: customerName => fbt(
			`Rappel nº2 envoyé à ${fbt.param(
				'customerName',
				customerName,
			)}`,
			'second reminder customer email',
		),
	},
	LAST: {
		text: customerName => fbt(
			`Dernier rappel (nº3) envoyé à ${fbt.param(
				'customerName',
				customerName,
			)}`,
			'third reminder customer email',
		),
	},
	INVOICE_DELAY: {
		text: customerName => fbt(
			`1er mail règlement de facture envoyé à ${fbt.param(
				'customerName',
				customerName,
			)}`,
			'first invoice email',
		),
	},
	INVOICE_FIRST: {
		text: customerName => fbt(
			`Rappel règlement de facture nº1 envoyé à ${fbt.param(
				'customerName',
				customerName,
			)}`,
			'first reminder invoice email',
		),
	},
	INVOICE_SECOND: {
		text: customerName => fbt(
			`Rappel règlement de facture nº2 envoyé à ${fbt.param(
				'customerName',
				customerName,
			)}`,
			'second reminder invoice email',
		),
	},
	INVOICE_THIRD: {
		text: customerName => fbt(
			`Rappel règlement de facture nº3 envoyé à ${fbt.param(
				'customerName',
				customerName,
			)}`,
			'third reminder invoice email',
		),
	},
	INVOICE_FOURTH: {
		text: customerName => fbt(
			`Rappel règlement de facture nº4 envoyé à ${fbt.param(
				'customerName',
				customerName,
			)}`,
			'fourth reminder invoice email',
		),
	},
	INVOICE_LAST: {
		text: customerName => fbt(
			`Dernier règlement de facture rappel (nº5) envoyé à ${fbt.param(
				'customerName',
				customerName,
			)}`,
			'fitfh reminder invoice email',
		),
	},
	CUSTOMER_REPORT: {
		text: customerName => fbt(
			`Rapport du jour envoyé à ${fbt.param(
				'customerName',
				customerName,
			)}`,
			'customer report email',
		),
	},
};

export const EVENT_TYPES = [
	{
		type: 'FOCUSED_TASK',
		get name() {
			return fbt('tâche programmée', 'FOCUSED_TASK event type name');
		},
	},
	{
		type: 'UNFOCUSED_TASK',
		get name() {
			return fbt('tâche déprogrammée', 'UNFOCUSED_TASK event type name');
		},
	},
	{
		type: 'SENT_REMINDER',
		get name() {
			return fbt('rappel envoyé', 'SENT_REMINDER event type name');
		},
	},
	{
		type: 'CANCELED_REMINDER',
		get name() {
			return fbt('rappel annulé', 'CANCELED_REMINDER event type name');
		},
	},
	{
		type: 'ADDED_TASK',
		get name() {
			return fbt('tâche ajoutée', 'ADDED_TASK event type name');
		},
	},
	{
		type: 'UPDATED_TASK',
		get name() {
			return fbt('tâche mise-à-jour', 'UPDATED_TASK event type name');
		},
	},
	{
		type: 'FINISHED_TASK',
		get name() {
			return fbt('tâche validée', 'FINISHED_TASK event type name');
		},
	},
	{
		type: 'UNFINISHED_TASK',
		get name() {
			return fbt('tâche dé-validée', 'UNFINISHED_TASK event type name');
		},
	},
	{
		type: 'REMOVED_TASK',
		get name() {
			return fbt('tâche supprimée', 'REMOVED_TASK event type name');
		},
	},
	{
		type: 'CREATED_PROJECT',
		get name() {
			return fbt('projet créé', 'CREATED_PROJECT event type name');
		},
	},
	{
		type: 'UPDATED_PROJECT',
		get name() {
			return fbt('projet mis-à-jour', 'UPDATED_PROJECT event type name');
		},
	},
	{
		type: 'ARCHIVED_PROJECT',
		get name() {
			return fbt('projet archivé', 'ARCHIVED_PROJECT event type name');
		},
	},
	{
		type: 'UNARCHIVED_PROJECT',
		get name() {
			return fbt(
				'projet dé-archivé',
				'UNARCHIVED_PROJECT event type name',
			);
		},
	},
	{
		type: 'POSTED_COMMENT',
		get name() {
			return fbt('commentaire posté', 'POSTED_COMMENT event type name');
		},
	},
	{
		type: 'ADDED_SECTION',
		get name() {
			return fbt('section ajoutée', 'ADDED_SECTION event type name');
		},
	},
	{
		type: 'UPDATED_SECTION',
		get name() {
			return fbt(
				'section mise-à-jour',
				'UPDATED_SECTION event type name',
			);
		},
	},
	{
		type: 'REMOVED_SECTION',
		get name() {
			return fbt('section supprimée', 'REMOVED_SECTION event type name');
		},
	},
	{
		type: 'UPLOADED_ATTACHMENT',
		get name() {
			return fbt(
				'document(s) ajouté(s)',
				'UPLOADED_ATTACHMENT event type name',
			);
		},
	},
	{
		type: 'REMOVED_ATTACHMENT',
		get name() {
			return fbt(
				'document(s) supprimé(s)',
				'REMOVED_ATTACHMENT event type name',
			);
		},
	},
	{
		type: 'LINKED_CUSTOMER_TO_TASK',
		get name() {
			return fbt(
				'client assigné à une tâche',
				'LINKED_CUSTOMER_TO_TASK event type name',
			);
		},
	},
	{
		type: 'UNLINKED_CUSTOMER_TO_TASK',
		get name() {
			return fbt(
				"client enlevé d'une tâche",
				'UNLINKED_CUSTOMER_TO_TASK event type name',
			);
		},
	},
	{
		type: 'LINKED_CUSTOMER_TO_PROJECT',
		get name() {
			return fbt(
				'client assigné à un projet',
				'LINKED_CUSTOMER_TO_PROJECT event type name',
			);
		},
	},
	{
		type: 'UNLINKED_CUSTOMER_TO_PROJECT',
		get name() {
			return fbt(
				"client enlevé d'un projet",
				'UNLINKED_CUSTOMER_TO_PROJECT event type name',
			);
		},
	},
	{
		type: 'LINKED_COLLABORATOR_TO_PROJECT',
		get name() {
			return fbt(
				'collaborateur assigné à un projet',
				'LINKED_COLLABORATOR_TO_PROJECT event type name',
			);
		},
	},
	{
		type: 'UNLINKED_COLLABORATOR_TO_PROJECT',
		get name() {
			return fbt(
				"collaborateur enlevé d'un projet",
				'UNLINKED_COLLABORATOR_TO_PROJECT event type name',
			);
		},
	},
	{
		type: 'ASSIGNED_TO_TASK',
		get name() {
			return fbt(
				'collaborateur assigné à une tâche',
				'ASSIGNED_TO_TASK event type name',
			);
		},
	},
	{
		type: 'REMOVE_ASSIGNMENT_TO_TASK',
		get name() {
			return fbt(
				"collaborateur enlevé d'une tâche",
				'REMOVE_ASSIGNMENT_TO_TASK event type name',
			);
		},
	},
	{
		type: 'VIEWED_PROJECT',
		get name() {
			return fbt('projet consulté', 'VIEWED_PROJECT event type name');
		},
	},
];

export const TAG_COLOR_PALETTE = [
	[[244, 67, 54], [255, 255, 255]],
	[[233, 30, 99], [255, 255, 255]],
	[[156, 39, 176], [255, 255, 255]],
	[[103, 58, 183], [255, 255, 255]],
	[[63, 81, 181], [255, 255, 255]],
	[[33, 150, 243], [255, 255, 255]],
	[[3, 169, 244], [255, 255, 255]],
	[[0, 188, 212], [255, 255, 255]],
	[[0, 150, 136], [255, 255, 255]],
	[[76, 175, 80], [255, 255, 255]],
	[[139, 195, 74], [255, 255, 255]],
	[[205, 220, 57], [51, 51, 51]],
	[[255, 235, 59], [51, 51, 51]],
	[[255, 193, 7], [51, 51, 51]],
	[[255, 152, 0], [255, 255, 255]],
	[[255, 87, 34], [255, 255, 255]],
	[[121, 85, 72], [255, 255, 255]],
	[[158, 158, 158], [255, 255, 255]],
	[[96, 125, 139], [255, 255, 255]],
];

export const DRAG_TYPES = {
	TASK: 'SCHEDULE_TASK',
	SECTION: 'SECTION',
};

export const PLAN_NAMES = {
	LIFE: 'LIFE',
	MONTHLY: 'MONTHLY',
	YEARLY: 'YEARLY',
	PROMO: 'PROMO',
	PH: 'PH',
	YEARLYPROMO: 'YEARLYPROMO',
};

export const STRIPE_CONSTANT
	= process.env.REACT_APP_INYO_ENV === 'production'
		? {
			stripeKey: 'pk_live_TpqUjTojdv9aqpzyj5otDoPM00xGrfnmF8',
			items: {
				[PLAN_NAMES.LIFE]: {
					sku: 'sku_FmHtrocbXWvbsS',
					quantity: 1,
				},
				[PLAN_NAMES.MONTHLY]: {
					plan: 'INYO_SUB',
					quantity: 1,
				},
				[PLAN_NAMES.PH]: {
					plan: 'sku_FrdvRBtGCcmCom',
					quantity: 1,
				},
				[PLAN_NAMES.YEARLY]: {
					plan: 'INYO_YEARLY',
					quantity: 1,
				},
				[PLAN_NAMES.PROMO]: {
					plan: 'plan_GFUTRbT0Ur7bmI',
					quantity: 1,
				},
				[PLAN_NAMES.YEARLYPROMO]: {
					plan: 'plan_GFyaaDajORBNcG',
					quantity: 1,
				},
			},
			successUrl: 'https://app.inyo.me/paid',
			cancelUrl: 'https://app.inyo.me/canceled',
		  }
		: {
			stripeKey: 'pk_test_sQRzrgMJ5zlrmL6glhP4mKe600LVdPEqRU',
			items: {
				[PLAN_NAMES.LIFE]: {
					sku: 'sku_FmKQx2r5EisRT8',
					quantity: 1,
				},
				[PLAN_NAMES.MONTHLY]: {
					plan: 'INYO_MONTHLY_USD',
					quantity: 1,
				},
				[PLAN_NAMES.PH]: {
					plan: 'sku_Frdwrqos88JUyC',
					quantity: 1,
				},
				[PLAN_NAMES.YEARLY]: {
					plan: 'INYO_YEARLY_USD',
					quantity: 1,
				},
				[PLAN_NAMES.PROMO]: {
					plan: 'plan_GFVhAITzMGhjT5',
					quantity: 1,
				},
				[PLAN_NAMES.YEARLYPROMO]: {
					plan: 'plan_GGHRrM0Hi37Xsn',
					quantity: 1,
				},
			},
			successUrl: 'https://dev.inyo.me/paid',
			cancelUrl: 'https://dev.inyo.me/canceled',
		  };
