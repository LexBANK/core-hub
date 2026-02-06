import { contentJson, OpenAPIRoute } from "chanfana";
import { z } from "zod";
import { AppContext } from "../../types";
import { createGitHubAIClient, chatCompletion } from "../../services/githubAI";

export class ChatCompletion extends OpenAPIRoute {
	public schema = {
		tags: ["Chat"],
		summary: "Send a chat completion request via GitHub AI",
		operationId: "chat-completion",
		request: {
			body: contentJson(
				z.object({
					system: z
						.string()
						.optional()
						.default("")
						.describe("System prompt to set the AI behavior"),
					message: z.string().describe("User message to send to the AI"),
				}),
			),
		},
		responses: {
			"200": {
				description: "Returns the AI-generated response",
				...contentJson({
					success: Boolean,
					result: z.object({
						response: z.string(),
					}),
				}),
			},
		},
	};

	public async handle(c: AppContext) {
		const data = await this.getValidatedData<typeof this.schema>();
		const env = c.env;

		const client = createGitHubAIClient(env);
		const response = await chatCompletion(
			client,
			env.GITHUB_AI_MODEL,
			data.body.system,
			data.body.message,
		);

		return {
			success: true,
			result: {
				response: response ?? "",
			},
		};
	}
}
