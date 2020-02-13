import moment from 'moment';

import {useQuery} from './apollo-hooks';
import {GET_USER_INFOS} from './queries';

export default function useUserInfos() {
	const {data, loading, error} = useQuery(GET_USER_INFOS);

	if (!data || !data.me || loading || error) {
		return {};
	}

	const {
		id,
		startWorkAt,
		endWorkAt,
		startBreakAt,
		endBreakAt,
		workingDays,
		settings,
		defaultDailyPrice,
		clientViews,
		lastName,
		firstName,
		company: {
			vat, vatRate, siret, rcs,
		},
	} = data.me;

	let workingTime = null;

	if (startWorkAt && endWorkAt) {
		const diffTime = moment(endWorkAt, 'HH:mm:ss').diff(
			moment(startWorkAt, 'HH:mm:ss'),
			'hours',
			true,
		);

		workingTime = diffTime < 0 ? diffTime + 24 : diffTime;
	}

	if (startBreakAt && endBreakAt) {
		const diffTime = moment(endBreakAt, 'HH:mm:ss').diff(
			moment(startBreakAt, 'HH:mm:ss'),
			'hours',
			true,
		);

		const breakTime = diffTime < 0 ? diffTime + 24 : diffTime;

		workingTime -= breakTime;
	}

	return {
		id,
		startWorkAt,
		endWorkAt,
		workingTime,
		workingDays,
		defaultDailyPrice,
		clientViews,
		language: settings.language,
		hasFullWeekSchedule: settings.hasFullWeekSchedule,
		assistantName: settings.assistantName,
		lastName,
		firstName,
		vat,
		vatRate,
		siret,
		rcs,
	};
}
