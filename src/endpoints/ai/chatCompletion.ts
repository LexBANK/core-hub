import { contentJson, OpenAPIRoute } from "chanfana";
import { z } from "zod";
import type { AppContext } from "../../types";
import { askGithubModel } from "../../services/githubModelService";

export class ChatCompletionEndpoint extends OpenAPIRoute {
	public schema = {
		tags: ["AI"],
		summary: "Generate a chat completion using the GitHub-hosted model",
		operationId: "ai-chat-completion",
		request: {
			body: contentJson(
				z.object({
					prompt: z.string().min(1),
				}),
			),
		},
		responses: {
			"200": {
				description: "The generated completion",
				...contentJson({
					success: z.boolean(),
					result: z.object({
						answer: z.string(),
					}),
				}),
			},
		},
	};

	public async handle(c: AppContext) {
		const data = await this.getValidatedData<typeof this.schema>();
		const answer = await askGithubModel(c.env, data.body.prompt);

		return {
			success: true,
			result: { answer },
		};
	}
}
