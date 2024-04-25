import { useEffect, useRef } from "react";

// TODO: test this component
export function Obsevable({
	onAppearance,
}: {
	onAppearance: (entry: IntersectionObserverEntry) => void;
}) {
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				onAppearance(entry);
			},
			{ threshold: 1 }
		);

		if (ref.current) {
			observer.observe(ref.current);
		}

		return () => {
			if (ref.current) {
				observer.unobserve(ref.current);
			}
		};
	}, [onAppearance]);

	return <div ref={ref} />;
}
