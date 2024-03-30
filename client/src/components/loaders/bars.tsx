import type { CSSProperties } from "react";

export function Bars() {
	return (
		<div className="loading-bars">
			<Bar order={1} />
			<Bar order={2} />
			<Bar order={3} />
			<Bar order={4} />
			<Bar order={5} />
		</div>
	);
}

function Bar({ order }: { order: number }) {
	return (
		<div
			className="loading-bar"
			style={{ "--order": order } as CSSProperties}
		></div>
	);
}
