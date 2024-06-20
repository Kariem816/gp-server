import { useEffect, useState } from "react";
import { useLocalStorage } from "~/hooks/useStorage";
import { TranslationContext, supportedLanguages } from "./context";

import type { TLang } from "./context";

export default function TranslationProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [language, setLanguage] = useLocalStorage<TLang>("language", "en");
	const [langData, setLangData] = useState<Record<string, string>>({});
	const [isLoading, setIsLoading] = useState(true);

	// layout direction
	const [isRTL, setIsRTL] = useState(language === "ar");

	useEffect(() => {
		// reflect the language change in the layout direction
		document.dir = isRTL ? "rtl" : "ltr";
		document.documentElement.lang = language;
	}, [isRTL]);

	// language
	useEffect(loadLanguage, [language]);

	function loadLanguage() {
		if (!language || language === "undefined") return;
		if (!supportedLanguages.includes(language)) return;

		setIsLoading(true);

		fetch(`/langs/${language}.json`)
			.then((res) => res.json())
			.then((data) => {
				setLangData(data);
			})
			.catch((error) => {
				console.error(error);
			})
			.finally(() => {
				setIsLoading(false);
			});
	}

	function changeLanguage(language: TLang) {
		if (!language) throw new Error("Language is required");
		setLanguage(language);
		setIsRTL(language === "ar");
	}

	function translate(key: string, ...values: string[]) {
		if (!key) throw new Error("Key is required for translation");
		if (!langData) return key;
		let translation = langData?.[key] ?? key;

		// check for {{}} and replace with text in values
		if (values.length > 0) {
			values.forEach((value, index) => {
				translation = translation.replace(
					`{{${index + 1}}}`,
					translate(value)
				);
			});
		}
		return translation;
	}

	return (
		<TranslationContext.Provider
			value={{
				language,
				setLanguage: changeLanguage,
				t: translate,
				isRTL,
				languages: supportedLanguages,
			}}
		>
			{children}
			{isLoading && (
				<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
					<div className="animate-spin rounded-full h-32 w-32 border-8 border-muted border-t-primary" />
				</div>
			)}
		</TranslationContext.Provider>
	);
}
