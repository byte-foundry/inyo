import moment from 'moment';

import {WEEKDAYS, CUSTOMER_TASK_TYPES} from './constants';

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

export const isCustomerTask = type => CUSTOMER_TASK_TYPES.includes(type);

export function extractScheduleFromWorkingDays(
	workingDays,
	iteratorDate,
	days,
	fullWeek,
	startDay,
) {
	const weekdays = [];

	do {
		const workedDay = workingDays.includes(WEEKDAYS[iteratorDate.day()]);

		if (fullWeek || workedDay) {
			const tasks
				= (days[iteratorDate.format(moment.HTML5_FMT.DATE)]
					&& days[iteratorDate.format(moment.HTML5_FMT.DATE)].tasks)
				|| [];

			tasks.sort((a, b) => a.schedulePosition - b.schedulePosition);

			weekdays.push({
				momentDate: iteratorDate.clone(),
				date: iteratorDate.format(moment.HTML5_FMT.DATE),
				tasks,
				workedDay,
			});
		}
	} while (
		iteratorDate.add(1, 'day').toDate() < startDay.endOf('week').toDate()
	);

	return weekdays;
}
