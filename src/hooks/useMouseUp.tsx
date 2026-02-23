import { useEffect, useState } from 'react';

type MouseUpEvent = Event;

export function useMouseUp(): MouseUpEvent | null {
	const [event, setEvent] = useState<MouseUpEvent | null>(null);

	useEffect(() => {
		const handler = (e: Event) => {
			setEvent(e);
		};
		window.addEventListener('mouseUp', handler);
		return () => {
			window.removeEventListener('mouseUp', handler);
		};
	}, []);

	return event;
}
