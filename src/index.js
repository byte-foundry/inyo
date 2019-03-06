import React, {Suspense} from 'react';
import ReactDOM from 'react-dom';
import {ApolloProvider} from 'react-apollo';
import {ApolloProvider as ApolloHooksProvider} from 'react-apollo-hooks';
import {BrowserRouter as Router} from 'react-router-dom';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import moment from 'moment';
import 'moment/locale/fr';

import './index.css';
import {Loading} from './utils/content';
import Container from './containers/Container';
import client from './utils/graphQLConfig';
import * as serviceWorker from './serviceWorker';
import {INTERCOM_APP_ID} from './utils/constants';

// Setting up locale mostly for react-dates
moment.locale((navigator && navigator.language) || 'fr-FR');

/* eslint-disable */
(function() {
	var w = window;
	var ic = w.Intercom;
	if (typeof ic === 'function') {
		ic('reattach_activator');
		ic('update', w.intercomSettings);
	} else {
		var d = document;
		var i = function() {
			i.c(arguments);
		};
		i.q = [];
		i.c = function(args) {
			i.q.push(args);
		};
		w.Intercom = i;
		var l = function() {
			var s = d.createElement('script');
			s.type = 'text/javascript';
			s.async = true;
			s.src = 'https://widget.intercom.io/widget/' + INTERCOM_APP_ID;
			var x = d.getElementsByTagName('script')[0];
			x.parentNode.insertBefore(s, x);
		};
		if (w.attachEvent) {
			w.attachEvent('onload', l);
		} else {
			w.addEventListener('load', l, false);
		}
	}
})();
/* eslint-enable */

// Deactivate temporarily all call to crisp
window.$crisp = {
	push: () => {},
};

ReactDOM.render(
	<ApolloProvider client={client}>
		<ApolloHooksProvider client={client}>
			<Router>
				<Suspense fallback={<Loading />}>
					<Container />
				</Suspense>
			</Router>
		</ApolloHooksProvider>
	</ApolloProvider>,
	document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
