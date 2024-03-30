import type { CSSProperties } from "react";

export function Dots() {
	return (
		<div
			className="loading-dots"
			style={{ "--total-dots": 5 } as CSSProperties}
		>
			<Dot order={1} />
			<Dot order={2} />
			<Dot order={3} />
			<Dot order={4} />
			<Dot order={5} />
		</div>
	);
}

function Dot({ order }: { order: number }) {
	return (
		<div
			className="loading-dot"
			style={{ "--order": order } as CSSProperties}
		/>
	);
}
