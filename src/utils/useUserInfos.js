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
		workingDays,
		settings,
		defaultDailyPrice,
		clientViews,
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
	};
}
