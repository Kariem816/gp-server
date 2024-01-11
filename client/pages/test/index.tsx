import React from "react";
import { FileRoute } from "@tanstack/react-router";
import { useLocalStorage } from "../../hooks/useStorage";

export const Route = new FileRoute('/test/').createRoute({
	component: Page,
});

function Page() {
	const [name, setName] = useLocalStorage<string>("name", "John");
	return (
		<>
			<div className="section">
				<h2>Local Storage Demo</h2>
				<input value={name} onChange={(e) => setName(e.target.value)} />
			</div>
		</>
	);
}
