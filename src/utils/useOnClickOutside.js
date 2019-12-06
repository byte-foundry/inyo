import arePassiveEventsSupported from 'are-passive-events-supported';
import {useEffect} from 'react';

export default function useOnClickOutside(ref, handler) {
	useEffect(() => {
		const listener = (event) => {
			// Do nothing if clicking ref's element or descendent elements, or if element is not in the DOM tree
			if (
				!ref.current
				|| ref.current.contains(event.target)
				|| !document.body.contains(event.target)
			) {
				return;
			}

			handler(event);
		};

		document.addEventListener('mousedown', listener);
		document.addEventListener(
			'touchstart',
			listener,
			arePassiveEventsSupported() ? {passive: true} : undefined,
		);

		return () => {
			document.removeEventListener('mousedown', listener);
			document.removeEventListener(
				'touchstart',
				listener,
				arePassiveEventsSupported() ? {passive: true} : undefined,
			);
		};
	}, [ref, handler]);
}
