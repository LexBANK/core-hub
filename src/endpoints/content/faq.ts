import { contentJson, OpenAPIRoute } from "chanfana";
import { z } from "zod";
import { AppContext } from "../../types";
import { faqByLocale } from "../../config/siteMeta";
import { localize, resolveLocale } from "../../i18n";

export class FaqEndpoint extends OpenAPIRoute {
	public schema = {
		tags: ["Content"],
		summary: "Get localized FAQ entries",
		operationId: "faq-list",
		responses: {
			"200": {
				description: "Localized FAQ list",
				...contentJson(
					z.object({
						success: z.literal(true),
						result: z.object({
							locale: z.enum(["en", "ar"]),
							items: z.array(
								z.object({
									question: z.string(),
									answer: z.string(),
								}),
							),
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
				items: localize(faqByLocale, locale),
			},
		};
	}
}
