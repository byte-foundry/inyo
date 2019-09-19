import moment from 'moment';
import {useEffect, useState} from 'react';

import GoogleCalendar from './calendars/googleCalendar';
import {getEventFromGoogleCalendarEvents} from './functions';
import useUserInfos from './useUserInfos';

const cache = {};

const useCalendar = (account, calendarOptions) => {
	const calendarManager = new GoogleCalendar(account);
	const [cacheVersion, setCacheVersion] = useState(0);
	const {startWorkAt, endWorkAt, workingTime} = useUserInfos();
	const cacheKey = [
		...calendarOptions,
		workingTime,
		startWorkAt,
		endWorkAt,
	].join('_');

	useEffect(() => {
		if (!cache[cacheKey].loaded && account.signedIn) {
			const effect = async () => {
				const googleEvents = getEventFromGoogleCalendarEvents(
					await calendarManager.getEvents(...calendarOptions),
					startWorkAt,
					endWorkAt,
					workingTime,
				);

				cache[cacheKey].data = googleEvents;
				cache[cacheKey].loaded = true;
				setCacheVersion(x => x + 1);
			};

			effect();
		}
	}, [
		account.signedIn,
		...calendarOptions,
		workingTime,
		startWorkAt,
		endWorkAt,
	]);

	if (!cache[cacheKey]) {
		cache[cacheKey] = {data: {}, loaded: false};
	}

	return {...cache[cacheKey]};
};

export default useCalendar;
