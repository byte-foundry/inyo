let instance;

export default class GoogleAccount {
	api = undefined;

	signedIn = false;

	userInfo = {};

	loading = true;

	setSignedIn = new Set();

	setUserInfo = new Set();

	setLoading = new Set();

	constructor(setSignedIn, setUserInfo, setLoading) {
		this.subscribe(setSignedIn, setUserInfo, setLoading);
		this.api = window.gapi;
		this.produceData();

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
					this.loading = false;
					this.api.auth2
						.getAuthInstance()
						.isSignedIn.listen((isSignedIn) => {
							if (isSignedIn) {
								this.signedIn = true;
								this.userInfo = this.loadAccountInfo();
								this.produceData();
								window.Intercom(
									'trackEvent',
									'connected-google-cal',
								);
							}
							else {
								this.signedIn = false;
								this.userInfo = {};
								this.produceData();
								window.Intercom(
									'trackEvent',
									'disconnected-google-cal',
								);
							}
						});

					if (this.api.auth2.getAuthInstance().isSignedIn.get()) {
						this.signedIn = true;
						this.userInfo = this.loadAccountInfo();
					}

					this.produceData();
				});
		};

		this.api.load('client', initClient);
	}

	produceData() {
		this.setSignedIn.forEach(setSignedIn => setSignedIn(this.signedIn));
		this.setUserInfo.forEach(setUserInfo => setUserInfo(this.userInfo));
		this.setLoading.forEach(setLoading => setLoading(this.loading));
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

	subscribe(setSignedIn, setUserInfo, setLoading) {
		this.setSignedIn.add(setSignedIn);
		this.setUserInfo.add(setUserInfo);
		this.setLoading.add(setLoading);
	}

	unsubscribe(setSignedIn, setUserInfo, setLoading) {
		this.setSignedIn.delete(setSignedIn);
		this.setUserInfo.delete(setUserInfo);
		this.setLoading.delete(setLoading);
	}

	signIn() {
		this.api.auth2.getAuthInstance().signIn();
	}

	signOut() {
		this.api.auth2.getAuthInstance().signOut();
	}

	static instance = (setSignedIn, setUserInfo, setLoading) => {
		if (!instance) {
			instance = new GoogleAccount(setSignedIn, setUserInfo, setLoading);
		}
		else {
			instance.subscribe(setSignedIn, setUserInfo, setLoading);
			setSignedIn(instance.signedIn);
			setUserInfo(instance.userInfo);
			setLoading(instance.loading);
		}

		return instance;
	};
}
