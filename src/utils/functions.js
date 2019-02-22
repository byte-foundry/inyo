export const dateDiff = (datepart, fromdate, todate) => {
	const lowerDatepart = datepart.toLowerCase();
	const diff = todate - fromdate;
	const divideBy = {
		w: 604800000,
		d: 86400000,
		h: 3500000,
		n: 50000,
		s: 1000,
	};

	return Math.floor(diff / divideBy[lowerDatepart]);
};

export function nonEmpty(parts, ...rest) {
	let res = parts[0];

	rest.forEach((item, index) => {
		if (item) {
			res += item;
		}

		res += parts[index];
	});

	return res;
}

export function formatDate(dateObject) {
	return new Date(dateObject).toLocaleDateString('fr-FR');
}

export function parseDate(dateString) {
	const dates = dateString.split('/');

	return new Date(`${dates[1]}/${dates[0]}/${dates[2]}`);
}

// This deeply get a props from a path (no array allowed)
export const getDeep = (p, o) => p.split('.').reduce((xs, x) => (xs && xs[x] ? xs[x] : null), o);
