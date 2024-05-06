const NUMBERS = "0123456789";
const ARABIC_NUMERALS = "٠١٢٣٤٥٦٧٨٩";

export function toArabicNumerals(text: string): string {
	let newText = "";

	for (const char of text) {
		if (NUMBERS.includes(char))
			newText += String.fromCharCode(char.charCodeAt(0) + 1584);
		else newText += char;
	}

	return newText;
}

export function toEnglishNumerals(text: string): string {
	let newText = "";

	for (const char of text) {
		if (ARABIC_NUMERALS.includes(char))
			newText += String.fromCharCode(char.charCodeAt(0) - 1584);
		else newText += char;
	}

	return newText;
}
