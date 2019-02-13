/* export const GRAPHQL_API = `https://prisma${
	// eslint-disable-line import/prefer-default-export
	process.env.REACT_APP_INYO_ENV === 'development' ? '-dev' : ''
}.inyo.me/`;
*/
export const GRAPHQL_API = 'http://prisma.prototypo.io:4002';

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
