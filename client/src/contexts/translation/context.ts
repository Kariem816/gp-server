import { createContext, useContext } from "react";

export const supportedLanguages = ["en", "ar"] as const;
export type TLang = (typeof supportedLanguages)[number];

interface TranslationContextValue {
	language: TLang | "undefined";
	setLanguage: (language: TLang) => void;
	t: (key: string, ...values: string[]) => string;
	isRTL: boolean;
	languages: typeof supportedLanguages;
}

const defaultValue: TranslationContextValue = {
	language: "undefined",
	setLanguage: () => {},
	t: (key) => key,
	isRTL: false,
	languages: supportedLanguages,
};

export const TranslationContext =
	createContext<TranslationContextValue>(defaultValue);

export function useTranslation() {
	return useContext(TranslationContext);
}
