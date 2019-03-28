import React from 'react';
import TaskIconUrl, {ReactComponent as TaskIcon} from './icons/taskicon.svg';
import TaskIconValidatedUrl from './icons/taskicon-user-validated.svg';
import TaskCustomerIconUrl, {
	ReactComponent as TaskCustomerIcon,
} from './icons/taskicon-customer.svg';
import TaskCustomerIconValidatedUrl from './icons/taskicon-customer-validated.svg';
import CustomerReminderIconUrl, {
	ReactComponent as CustomerReminderIcon,
} from './icons/customer-reminder.svg';
import UserReminderIconUrl, {
	ReactComponent as UserReminderIcon,
} from './icons/user-reminder.svg';
import ValidationIconUrl, {
	ReactComponent as ValidationIcon,
} from './icons/validation.svg';
import ContentAcquisitionIconUrl, {
	ReactComponent as ContentAcquisitionIcon,
} from './icons/content-acquisition.svg';

/* export const GRAPHQL_API = `https://prisma${
	// eslint-disable-line import/prefer-default-export
	process.env.REACT_APP_INYO_ENV === 'development' ? '-dev' : ''
}.inyo.me/`; */
export const GRAPHQL_API = 'http://prisma.prototypo.io:4002/';

export const INTERCOM_APP_ID
	= process.env.REACT_APP_INYO_ENV === 'development' ? 'cg8ntaar' : 'imlnj7st';

export const WEEKDAYS_SHORT = {
	fr: ['Di', 'Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa'],
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

export const TOOLTIP_DELAY = 650;

export const BREAKPOINTS = [420];

export const ITEM_TYPES = [
	{
		icon: <TaskIcon />,
		iconUrl: TaskIconUrl,
		iconUrlValidated: TaskIconValidatedUrl,
		type: 'DEFAULT',
		name: 'Basique',
		description: 'Une tâche dont vous êtes responsable',
	},
	{
		icon: <TaskCustomerIcon />,
		iconUrl: TaskCustomerIconUrl,
		iconUrlValidated: TaskCustomerIconValidatedUrl,
		type: 'CUSTOMER',
		name: 'Tâche attribuée au client',
		description: 'Une tâche à réaliser par votre client',
	},
	{
		icon: <ContentAcquisitionIcon />,
		iconUrl: ContentAcquisitionIconUrl,
		iconUrlValidated: TaskCustomerIconValidatedUrl,
		type: 'CONTENT_ACQUISITION',
		name: 'Récupération contenu',
		description: 'Lister et récupérer les contenus nécessaires',
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
		text: customerName => `Premier mail envoyé à ${customerName}`,
	},
	FIRST: {
		text: customerName => `Premier rappel envoyé à ${customerName}`,
	},
	SECOND: {
		text: customerName => `Second rappel envoyé à ${customerName}`,
	},
	LAST: {
		text: customerName => `Dernier rappel envoyé à ${customerName}`,
	},
};
