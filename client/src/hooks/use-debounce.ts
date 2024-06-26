import { useEffect, useState } from "react";

export default function useDebounce<T>(value: T, delay = 1000) {
	const [debouncedValue, setDebouncedValue] = useState<T>(value);

	useEffect(() => {
		const id = setTimeout(() => {
			setDebouncedValue(value);
		}, delay);

		return () => {
			clearTimeout(id);
		};
	}, [value, delay]);

	return debouncedValue;
}
