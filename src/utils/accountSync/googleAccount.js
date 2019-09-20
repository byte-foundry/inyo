let instance;

export default class GoogleAccount {
	api = undefined;

	signedIn = false;

	userInfo = {};

	setSignedIn = undefined;

	setUserInfo = undefined;

	constructor(setSignedIn, setUserInfo) {
		this.setSignedIn = setSignedIn;
		this.setUserInfo = setUserInfo;
		this.api = window.gapi;

		const initClient = () => {
			this.api.client
				.init({
					apiKey: process.env.REACT_APP_GOOGLE_API_KEY,
					discoveryDocs: [
						'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest',
					],
					clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID,
					scope:
						'https://www.googleapis.com/auth/calendar.events.readonly',
				})
				.then(() => {
					this.api.auth2
						.getAuthInstance()
						.isSignedIn.listen((isSignedIn) => {
							if (isSignedIn) {
								this.signedIn = true;
								this.userInfo = this.loadAccountInfo();
								this.setSignedIn(this.signedIn);
								this.setUserInfo(this.userInfo);
								window.Intercom(
									'trackEvent',
									'connected-google-cal',
								);
							}
							else {
								this.signedIn = false;
								this.userInfo = {};
								this.setSignedIn(this.signedIn);
								this.setUserInfo(this.userInfo);
								window.Intercom(
									'trackEvent',
									'disconnected-google-cal',
								);
							}
						});

					if (this.api.auth2.getAuthInstance().isSignedIn.get()) {
						this.signedIn = true;
						this.userInfo = this.loadAccountInfo();
						this.setSignedIn(this.signedIn);
						this.setUserInfo(this.userInfo);
					}
				});
		};

		this.api.load('client', initClient);
	}

	loadAccountInfo() {
		const currentUser = this.api.auth2
			.getAuthInstance()
			.currentUser.get()
			.getBasicProfile();
		const googleUser = {
			name: currentUser.getName(),
			email: currentUser.getEmail(),
			image: currentUser.getImageUrl(),
		};

		return googleUser;
	}

	signIn() {
		this.api.auth2.getAuthInstance().signIn();
	}

	signOut() {
		this.api.auth2.getAuthInstance().signOut();
	}

	static instance = (setSignedIn, setUserInfo) => {
		if (!instance) {
			instance = new GoogleAccount(setSignedIn, setUserInfo);
		}
		else {
			setSignedIn(instance.signedIn);
			setUserInfo(instance.userInfo);
			instance.setSignedIn = setSignedIn;
			instance.setUserInfo = setUserInfo;
		}

		return instance;
	};
}
