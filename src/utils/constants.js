import React from 'react';

import ContentAcquisitionIconUrl, {
	ReactComponent as ContentAcquisitionIcon,
} from './icons/content-acquisition.svg';
import TaskInvoiceIconUrl, {
	ReactComponent as TaskInvoiceIcon,
} from './icons/invoice-icon.svg';
import SectionIconUrl, {
	ReactComponent as SectionIcon,
} from './icons/section-icon.svg';
import TaskCustomerIconValidatedAnimUrl from './icons/taskicon-customer-validated-anim.svg';
import TaskCustomerIconValidatedUrl, {
	ReactComponent as TaskCustomerIconValidated,
} from './icons/taskicon-customer-validated.svg';
import TaskCustomerIconUrl, {
	ReactComponent as TaskCustomerIcon,
} from './icons/taskicon-customer.svg';
import TaskIconValidatedAnimUrl from './icons/taskicon-user-validated-anim.svg';
import TaskIconValidatedUrl, {
	ReactComponent as TaskIconValidated,
} from './icons/taskicon-user-validated.svg';
import TaskIconUrl, {ReactComponent as TaskIcon} from './icons/taskicon.svg';

export const GRAPHQL_API = `https://prisma${
	// eslint-disable-line import/prefer-default-export
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

export const WEEKDAYS_SHORT = {
	fr: ['Di', 'Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa'],
};

export const TITLE_ENUM_TO_TITLE = {
	MONSIEUR: 'M.',
	MADAME: 'Mme',
};

export const MONTHS = {
	fr: [
		'Janvier',
		'Février',
		'Mars',
		'Avril',
		'Mai',
		'Juin',
		'Juillet',
		'Août',
		'Septembre',
		'Octobre',
		'Novembre',
		'Décembre',
	],
};

export const WEEKDAYS_LONG = {
	fr: [
		'Dimanche',
		'Lundi',
		'Mardi',
		'Mercredi',
		'Jeudi',
		'Vendredi',
		'Smedi',
	],
};

export const FIRST_DAY_OF_WEEK = {
	fr: 1,
};
// Translate aria-labels
export const LABELS = {
	fr: {nextMonth: 'Mois suivant', previousMonth: 'Mois précédent'},
};

export const itemStatuses = {
	FINISHED: 'FINISHED',
	PENDING: 'PENDING',
};

export const BREAKPOINTS = [420];

export const CUSTOMER_TASK_TYPES = [
	'CUSTOMER',
	'CONTENT_ACQUISITION',
	'INVOICE',
];

export const ITEM_TYPES = [
	{
		icon: <TaskIcon />,
		iconValidated: <TaskIconValidated />,
		iconUrl: TaskIconUrl,
		iconUrlValidated: TaskIconValidatedUrl,
		iconUrlValidatedAnim: TaskIconValidatedAnimUrl,
		type: 'DEFAULT',
		name: 'Basique',
		description: 'Une tâche dont vous êtes responsable',
	},
	{
		icon: <TaskCustomerIcon />,
		iconValidated: <TaskCustomerIconValidated />,
		iconUrl: TaskCustomerIconUrl,
		iconUrlValidated: TaskCustomerIconValidatedUrl,
		iconUrlValidatedAnim: TaskCustomerIconValidatedAnimUrl,
		type: 'CUSTOMER',
		name: 'Tâche attribuée au client',
		description: 'Une tâche à réaliser par votre client',
	},
	{
		icon: <ContentAcquisitionIcon />,
		iconValidated: <TaskCustomerIconValidated />,
		iconUrl: ContentAcquisitionIconUrl,
		iconUrlValidated: TaskCustomerIconValidatedUrl,
		type: 'CONTENT_ACQUISITION',
		name: 'Récupération contenu',
		description: 'Lister et récupérer les contenus nécessaires',
	},
	{
		icon: <SectionIcon />,
		iconValidated: <TaskCustomerIconValidated />,
		iconUrl: SectionIconUrl,
		iconUrlValidated: TaskCustomerIconValidatedUrl,
		type: 'SECTION',
		name: 'Section de projet',
		description: "Créer une section pour classer les tâches d'un projet",
	},
	{
		icon: <TaskInvoiceIcon />,
		iconValidated: <TaskCustomerIconValidated />,
		iconUrl: TaskInvoiceIconUrl,
		iconUrlValidated: TaskCustomerIconValidatedUrl,
		type: 'INVOICE',
		name: 'Paiement de facture',
		description:
			'Envoyer une facture et demander un paiement à votre client',
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
	},
	{
		icon: '⭕',
		type: 'PERSONAL',
		name: 'Tâche personnelle',
		description: 'Créer une tâche uniquement visible par vous',
	}, */
];

export const REMINDER_TYPES_DATA = {
	DELAY: {
		text: customerName => `1er mail envoyé à ${customerName}`,
	},
	FIRST: {
		text: customerName => `Rappel nº1 envoyé à ${customerName}`,
	},
	SECOND: {
		text: customerName => `Rappel nº2 envoyé à ${customerName}`,
	},
	LAST: {
		text: customerName => `Dernier rappel (nº3) envoyé à ${customerName}`,
	},
	INVOICE_DELAY: {
		text: customerName => `1er mail règlement de facture envoyé à ${customerName}`,
	},
	INVOICE_FIRST: {
		text: customerName => `Rappel règlement de facture nº1 envoyé à ${customerName}`,
	},
	INVOICE_SECOND: {
		text: customerName => `Rappel règlement de facture nº2 envoyé à ${customerName}`,
	},
	INVOICE_THIRD: {
		text: customerName => `Rappel règlement de facture nº3 envoyé à ${customerName}`,
	},
	INVOICE_FOURTH: {
		text: customerName => `Rappel règlement de facture nº4 envoyé à ${customerName}`,
	},
	INVOICE_LAST: {
		text: customerName => `Dernier règlement de facture rappel (nº5) envoyé à ${customerName}`,
	},
};

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
};

export const STRIPE_CONSTANT
	= process.env.REACT_APP_INYO_ENV === 'production'
		? {
			stripeKey: 'pk_live_TpqUjTojdv9aqpzyj5otDoPM00xGrfnmF8',
			items: {
				[PLAN_NAMES.LIFE]: {
					sku: 'sku_FF2rL7Jk5zl0C7',
					quantity: 1,
				},
				[PLAN_NAMES.MONTHLY]: {
					plan: 'INYO_MONTHLY',
					quantity: 1,
				},
				[PLAN_NAMES.YEARLY]: {
					plan: 'plan_FJQhEIJQnlzriF',
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
					sku: 'sku_F9hrygxAJQuSLp',
					quantity: 1,
				},
				[PLAN_NAMES.MONTHLY]: {
					plan: 'INYO_MONTHLY',
					quantity: 1,
				},
				[PLAN_NAMES.YEARLY]: {
					plan: 'INYO_YEARLY',
					quantity: 1,
				},
			},
			successUrl: 'https://dev.inyo.me/paid',
			cancelUrl: 'https://dev.inyo.me/canceled',
		  };
