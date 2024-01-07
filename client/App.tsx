import React from "react"; // Find a way to remove this line (tsconfig.json)
import { useState, useEffect } from "react";

function App() {
	const [response, setResponse] = useState<object>();
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		fetch("/api")
			.then((res) => res.json())
			.then((data) => setResponse(data))
			.catch(console.error)
			.finally(() => setLoading(false));
	}, []);

	return (
		<>
			<h1>Hello Mom!</h1>
			{loading && <div className="loader" />}

			{response && <p>{JSON.stringify(response, null, 4)}</p>}
		</>
	);
}

export default App;
