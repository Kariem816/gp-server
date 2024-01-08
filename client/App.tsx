import React from "react"; // Find a way to remove this line (tsconfig.json)
import { useState, useEffect } from "react";

import "./App.css";

function App() {
	const [response, setResponse] = useState<object>();
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		new Promise((resolve) => setTimeout(resolve, 5000)).then(() => {
			fetch("/api")
				.then((res) => res.json())
				.then((data) => setResponse(data))
				.catch(console.error)
				.finally(() => setLoading(false));
		});
	}, []);

	return (
		<>
			<div className="section">
				<img src="/logo.svg" alt="logo" />
				<h1>Smart Campus</h1>
			</div>

			<div className="section">
				<h2>Connection Demo</h2>
				{loading && (
					<>
						<div className="loader" />
						<small>Delay is synthetic</small>
					</>
				)}
				{response && (
					<code>
						<pre>{JSON.stringify(response, null, 4)}</pre>
					</code>
				)}
			</div>
		</>
	);
}

export default App;
