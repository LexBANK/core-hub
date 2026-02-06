import { contentJson, OpenAPIRoute } from "chanfana";
import { z } from "zod";
import { AppContext } from "../../types";
import { setConfig } from "../../services/config";
import { logAudit } from "../../services/audit";

export class SetVerificationToken extends OpenAPIRoute {
	public schema = {
		tags: ["Admin"],
		summary: "Set the OpenAI domain verification token",
		operationId: "set-verification-token",
		security: [{ bearerAuth: [] }],
		request: {
			body: contentJson(
				z.object({
					token: z.string().min(1).describe("OpenAI verification token"),
				}),
			),
		},
		responses: {
			"200": {
				description: "Token saved successfully",
				...contentJson({
					success: Boolean,
					result: z.object({
						message: z.string(),
					}),
				}),
			},
		},
	};

	public async handle(c: AppContext) {
		const env = c.env;

		const auth = c.req.header("Authorization") ?? "";
		if (auth !== `Bearer ${env.COREHUB_ADMIN_KEY}`) {
			return c.json(
				{ success: false, errors: [{ code: 4010, message: "Unauthorized" }] },
				401,
			);
		}

		const data = await this.getValidatedData<typeof this.schema>();
		await setConfig(env.DB, "openai_verification_token", data.body.token);
		await logAudit(env.DB, "set_verification_token", "admin");

		return {
			success: true,
			result: { message: "Verification token saved" },
		};
	}
}
