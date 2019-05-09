import React from 'react';
import TaskIconUrl, {ReactComponent as TaskIcon} from './icons/taskicon.svg';
import TaskIconValidatedUrl, {
	ReactComponent as TaskIconValidated,
} from './icons/taskicon-user-validated.svg';
import TaskIconValidatedAnimUrl from './icons/taskicon-user-validated-anim.svg';
import TaskCustomerIconUrl, {
	ReactComponent as TaskCustomerIcon,
} from './icons/taskicon-customer.svg';
import TaskCustomerIconValidatedUrl, {
	ReactComponent as TaskCustomerIconValidated,
} from './icons/taskicon-customer-validated.svg';
import TaskCustomerIconValidatedAnimUrl from './icons/taskicon-customer-validated-anim.svg';

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

export const TOOLTIP_DELAY = 650;

export const BREAKPOINTS = [420];

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
		text: customerName => `1er rappel envoyé à ${customerName}`,
	},
	SECOND: {
		text: customerName => `2nd rappel envoyé à ${customerName}`,
	},
	LAST: {
		text: customerName => `Dernier rappel envoyé à ${customerName}`,
	},
};

export const TAG_COLOR_PALETTE = [
	[[227, 230, 218], [80, 59, 141]],
	[[231, 188, 177], [39, 146, 46]],
	[[218, 228, 214], [56, 54, 150]],
	[[88, 72, 135], [196, 234, 215]],
	[[78, 170, 67], [199, 245, 212]],
	[[206, 188, 147], [50, 92, 139]],
	[[212, 40, 6], [222, 230, 234]],
	[[234, 209, 201], [64, 120, 188]],
	[[185, 179, 97], [34, 90, 162]],
	[[56, 87, 153], [194, 216, 191]],
	[[241, 91, 98], [220, 236, 214]],
	[[46, 59, 173], [143, 236, 236]],
	[[246, 126, 214], [61, 69, 142]],
	[[200, 176, 200], [66, 74, 145]],
	[[51, 141, 44], [222, 214, 226]],
	[[222, 227, 213], [55, 60, 133]],
	[[241, 89, 115], [228, 221, 231]],
	[[200, 186, 208], [66, 60, 138]],
	[[204, 232, 213], [74, 94, 143]],
	[[191, 254, 226], [130, 94, 214]],
	[[112, 188, 116], [53, 102, 49]],
	[[23, 92, 37], [199, 201, 92]],
	[[193, 178, 13], [145, 60, 49]],
	[[134, 233, 220], [250, 58, 118]],
	[[176, 242, 198], [220, 84, 109]],
	[[195, 185, 148], [47, 128, 194]],
	[[180, 186, 16], [224, 228, 215]],
	[[180, 145, 112], [6, 74, 110]],
	[[224, 218, 229], [29, 75, 43]],
	[[237, 230, 34], [45, 84, 151]],
	[[160, 161, 206], [142, 65, 42]],
	[[234, 231, 218], [52, 89, 145]],
	[[88, 65, 135], [145, 252, 186]],
	[[144, 103, 233], [240, 224, 213]],
	[[145, 251, 157], [80, 143, 35]],
	[[79, 140, 35], [229, 228, 210]],
	[[98, 48, 147], [127, 217, 233]],
	[[159, 61, 28], [222, 209, 193]],
	[[117, 235, 222], [38, 84, 45]],
	[[213, 243, 220], [144, 108, 194]],
	[[168, 199, 53], [129, 40, 134]],
	[[41, 84, 158], [204, 252, 219]],
	[[104, 109, 218], [217, 233, 218]],
	[[156, 109, 238], [202, 251, 233]],
	[[242, 222, 213], [243, 83, 91]],
	[[126, 228, 214], [229, 56, 8]],
	[[243, 130, 186], [27, 93, 154]],
	[[85, 149, 45], [230, 232, 219]],
];
