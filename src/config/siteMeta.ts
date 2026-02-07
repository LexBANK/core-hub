import { SupportedLocale } from "../i18n";

export type LocalizedSiteMeta = {
	title: string;
	description: string;
	keywords: string[];
	canonicalUrl: string;
	ogType: "website";
};

export const siteMetaByLocale: Record<SupportedLocale, LocalizedSiteMeta> = {
	en: {
		title: "CoreHub - API Platform",
		description: "Unified API Product with Docs, Status, and Live Testing.",
		keywords: ["CoreHub", "API", "Docs", "Status", "Developer"],
		canonicalUrl: "https://corehub.nexus",
		ogType: "website",
	},
	ar: {
		title: "CoreHub - منصة API",
		description: "منصة API موحدة مع التوثيق والحالة والاختبار المباشر.",
		keywords: ["CoreHub", "واجهة برمجة التطبيقات", "توثيق", "حالة", "مطور"],
		canonicalUrl: "https://corehub.nexus/ar",
		ogType: "website",
	},
};

export const faqByLocale: Record<SupportedLocale, Array<{ question: string; answer: string }>> = {
	en: [
		{ question: "How do I authenticate?", answer: "Use an API token in the Authorization header." },
		{ question: "Where are docs hosted?", answer: "You can find API docs at the root URL /." },
	],
	ar: [
		{ question: "كيف أوثّق الطلبات؟", answer: "استخدم رمز API في ترويسة Authorization." },
		{ question: "أين أجد التوثيق؟", answer: "ستجد توثيق API على المسار الرئيسي /." },
	],
};
