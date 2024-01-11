import { useCallback, useState, useEffect } from "react";

export function useLocalStorage<T>(key: string, defaultValue: T | (() => T)) {
	return useStorage(key, defaultValue, window.localStorage);
}

export function useSessionStorage<T = any>(
	key: string,
	defaultValue: T | (() => T)
) {
	return useStorage(key, defaultValue, window.sessionStorage);
}

function useStorage<T = any>(
	key: string,
	defaultValue: T,
	storageObject: Storage
) {
	const [value, setValue] = useState(() => {
		const jsonValue = storageObject.getItem(key);
		if (jsonValue != null) return JSON.parse(jsonValue);

		if (typeof defaultValue === "function") {
			return defaultValue();
		} else {
			return defaultValue;
		}
	});

	useEffect(() => {
		if (value === undefined) return storageObject.removeItem(key);
		storageObject.setItem(key, JSON.stringify(value));
	}, [key, value, storageObject]);

	const remove = useCallback(() => {
		setValue(undefined);
	}, []);

	return [value, setValue, remove];
}
