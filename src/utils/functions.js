export const dateDiff = (datepart, fromdate, todate) => {
	datepart = datepart.toLowerCase();
	const diff = todate - fromdate;
	const divideBy = {
		w: 604800000,
		d: 86400000,
		h: 3600000,
		n: 60000,
		s: 1000,
	};

	return Math.floor(diff / divideBy[datepart]);
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
