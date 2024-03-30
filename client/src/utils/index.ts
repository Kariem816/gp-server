import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

function capitalizeWord(word: string) {
	return word.charAt(0).toUpperCase() + word.slice(1);
}

export function capitalize(str: string) {
	return str.split(" ").map(capitalizeWord).join(" ");
}

export function filterize(obj: any, extended: boolean = false) {
	const newObj: any = {};

	for (const key in obj) {
		if (obj[key]) newObj["filter_" + key] = obj[key];
	}

	if (extended) newObj.extended_filters = true;

	return newObj;
}
