import { contentJson, OpenAPIRoute } from "chanfana";
import { AppContext } from "../types";
import { z } from "zod";
import { localize, resolveLocale } from "../i18n";

export class DummyEndpoint extends OpenAPIRoute {
	public schema = {
		tags: ["Dummy"],
		summary: "This endpoint is an example",
		operationId: "example-endpoint", // This is optional
		request: {
			params: z.object({
				slug: z.string(),
			}),
			body: contentJson(
				z.object({
					name: z.string(),
				}),
			),
		},
		responses: {
			"200": {
				description: "Returns localized details",
				...contentJson({
					success: Boolean,
					result: z.object({
						msg: z.string(),
						locale: z.enum(["en", "ar"]),
						slug: z.string(),
						name: z.string(),
					}),
				}),
			},
		},
	};

	public async handle(c: AppContext) {
		const data = await this.getValidatedData<typeof this.schema>();
		const locale = resolveLocale(c.req.header("accept-language"));

		return {
			success: true,
			result: {
				msg: localize(
					{
						en: "This is a dummy endpoint, serving as an example",
						ar: "هذه نقطة نهاية تجريبية كمثال",
					},
					locale,
				),
				locale,
				slug: data.params.slug,
				name: data.body.name,
			},
		};
	}
}
