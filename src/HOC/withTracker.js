import React, {useEffect} from 'react';
import ReactGA from 'react-ga';

const TrackComponent = ({options, location, children}) => {
	const page = location.pathname + location.search;

	useEffect(() => {
		ReactGA.set({
			page,
			...options
		});
		ReactGA.pageview(page);
	}, [page]);

	return children;
};

export default (WrappedComponent, options = {}) => {
	return props => (
		<TrackComponent {...props} options={options}>
			<WrappedComponent {...props} />
		</TrackComponent>
	);
};
