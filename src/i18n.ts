export const SUPPORTED_LOCALES = ["en", "ar"] as const;

export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

const LANGUAGE_WEIGHT_SEPARATOR = ";q=";

export function isSupportedLocale(locale: string): locale is SupportedLocale {
	return SUPPORTED_LOCALES.includes(locale as SupportedLocale);
}

export function resolveLocale(acceptLanguageHeader?: string | null): SupportedLocale {
	if (!acceptLanguageHeader) {
		return "en";
	}

	const weightedLocales = acceptLanguageHeader
		.split(",")
		.map((entry) => {
			const [rawLocale, rawWeight] = entry.trim().split(LANGUAGE_WEIGHT_SEPARATOR);
			const normalizedLocale = rawLocale.toLowerCase();
			const baseLocale = normalizedLocale.split("-")[0];
			const weight = rawWeight ? Number.parseFloat(rawWeight) : 1;

			return {
				locale: baseLocale,
				weight: Number.isFinite(weight) ? weight : 0,
			};
		})
		.filter((entry): entry is { locale: SupportedLocale; weight: number } => isSupportedLocale(entry.locale))
		.sort((a, b) => b.weight - a.weight);

	return weightedLocales[0]?.locale ?? "en";
}

export function localize<T>(translations: Record<SupportedLocale, T>, locale: SupportedLocale): T {
	return translations[locale] ?? translations.en;
}
