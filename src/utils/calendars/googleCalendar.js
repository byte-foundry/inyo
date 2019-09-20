export default class GoogleCalendar {
	api = undefined;

	accountManager = undefined;

	constructor(accountManager) {
		this.accountManager = accountManager;
	}

	getEvents(calendarId, timeMin, timeMax) {
		if (this.accountManager.signedIn) {
			return this.accountManager.api.client.calendar.events.list({
				calendarId,
				timeMin,
				timeMax,
				singleEvents: true,
			});
		}

		return [];
	}
}
