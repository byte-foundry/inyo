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
					apiKey: 'AIzaSyC0aZgvpgGnIbF2ZcTUg-apG98CtTkoql4',
					discoveryDocs: [
						'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest',
					],
					clientId:
						'937092301568-ip4jvj47cjlm1hc2vg8jb89dch6fhvo4.apps.googleusercontent.com',
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
							}
							else {
								this.signedIn = false;
								this.userInfo = {};
								this.setSignedIn(this.signedIn);
								this.setUserInfo(this.userInfo);
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
		}

		return instance;
	};
}
