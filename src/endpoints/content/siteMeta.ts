import { contentJson, OpenAPIRoute } from "chanfana";
import { z } from "zod";
import { AppContext } from "../../types";
import { localize, resolveLocale } from "../../i18n";
import { siteMetaByLocale } from "../../config/siteMeta";

export class SiteMetaEndpoint extends OpenAPIRoute {
	public schema = {
		tags: ["Content"],
		summary: "Get localized SEO metadata",
		operationId: "site-meta",
		responses: {
			"200": {
				description: "Localized site metadata",
				...contentJson(
					z.object({
						success: z.literal(true),
						result: z.object({
							locale: z.enum(["en", "ar"]),
							title: z.string(),
							description: z.string(),
							keywords: z.array(z.string()),
							canonicalUrl: z.string().url(),
							ogType: z.literal("website"),
						}),
					}),
				),
			},
		},
	};

	public async handle(c: AppContext) {
		const locale = resolveLocale(c.req.header("accept-language"));

		return {
			success: true as const,
			result: {
				locale,
				...localize(siteMetaByLocale, locale),
			},
		};
	}
}
