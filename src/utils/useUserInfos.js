import moment from 'moment';
import {useQuery} from 'react-apollo-hooks';

import {GET_USER_INFOS} from './queries';

export default function useUserInfos() {
	const {data, loading, error} = useQuery(GET_USER_INFOS);

	if (!data || !data.me || loading || error) {
		return null;
	}

	const {
		startWorkAt, endWorkAt, workingDays, settings,
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
		startWorkAt,
		endWorkAt,
		workingTime,
		workingDays,
		hasFullWeekSchedule: settings.hasFullWeekSchedule,
	};
}
