import { contentJson, OpenAPIRoute } from "chanfana";
import { z } from "zod";
import { AppContext } from "../../types";
import { generateTurnCredentials } from "../../services/turn";

export class TurnCredentials extends OpenAPIRoute {
	public schema = {
		tags: ["TURN"],
		summary: "Generate short-lived TURN server credentials for WebRTC",
		operationId: "turn-credentials",
		request: {
			body: contentJson(
				z.object({
					ttl: z
						.number()
						.int()
						.min(60)
						.max(86400)
						.optional()
						.default(86400)
						.describe("Time to live in seconds (default: 86400)"),
				}),
			),
		},
		responses: {
			"200": {
				description: "Returns ICE server credentials for WebRTC",
				...contentJson({
					success: Boolean,
					result: z.object({
						iceServers: z.array(
							z.object({
								urls: z.array(z.string()),
								username: z.string(),
								credential: z.string(),
							}),
						),
					}),
				}),
			},
		},
	};

	public async handle(c: AppContext) {
		const data = await this.getValidatedData<typeof this.schema>();
		const env = c.env;

		const credentials = await generateTurnCredentials(env, data.body.ttl);

		return {
			success: true,
			result: credentials,
		};
	}
}
