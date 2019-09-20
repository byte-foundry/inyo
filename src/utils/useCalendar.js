import moment from 'moment';
import {useEffect, useState} from 'react';

import GoogleCalendar from './calendars/googleCalendar';
import {getEventFromGoogleCalendarEvents} from './functions';
import useUserInfos from './useUserInfos';

let cache = {};

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

	console.log('useCalendar for', cacheKey);

	if (account && account.api && account.api.auth2) {
		account.api.auth2.getAuthInstance().isSignedIn.listen((isSignedIn) => {
			if (!isSignedIn) {
				cache = {};
				setCacheVersion(x => x + 1);
			}
		});
	}

	useEffect(() => {
		console.log('useCalendar effect for', cacheKey);
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
				console.log('cache fed for', cacheKey);
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
