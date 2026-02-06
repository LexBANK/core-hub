import { contentJson, OpenAPIRoute } from "chanfana";
import { AppContext } from "../types";
import { z } from "zod";
import ModelClient, { isUnexpected } from "@azure-rest/ai-inference";
import { AzureKeyCredential } from "@azure/core-auth";

export class ChatCompletions extends OpenAPIRoute {
	public schema = {
		tags: ["AI"],
		summary: "Generate chat completions using GitHub Models",
		operationId: "chat-completions",
		request: {
			body: contentJson(
				z.object({
					messages: z.array(
						z.object({
							role: z.enum(["system", "user", "assistant"]),
							content: z.string(),
						}),
					),
					temperature: z.number().min(0).max(2).optional().default(0.8),
					top_p: z.number().min(0).max(1).optional().default(0.1),
					max_tokens: z.number().min(1).optional().default(2048),
					model: z.string().optional().default("deepseek/DeepSeek-V3-0324"),
				}),
			),
		},
		responses: {
			"200": {
				description: "Returns the chat completion response",
				...contentJson({
					success: z.boolean(),
					result: z.object({
						content: z.string(),
					}),
				}),
			},
			"400": {
				description: "Bad request - invalid parameters",
				...contentJson({
					success: z.boolean(),
					error: z.string(),
				}),
			},
			"500": {
				description: "Internal server error",
				...contentJson({
					success: z.boolean(),
					error: z.string(),
				}),
			},
		},
	};

	public async handle(c: AppContext) {
		const data = await this.getValidatedData<typeof this.schema>();

		// Get the GitHub token from environment variables
		const token = c.env.GITHUB_TOKEN;
		if (!token) {
			return c.json(
				{
					success: false,
					error: "GITHUB_TOKEN environment variable is not set",
				},
				500,
			);
		}

		const endpoint = "https://models.github.ai/inference";

		try {
			// Create the client
			const client = ModelClient(endpoint, new AzureKeyCredential(token));

			// Make the API call
			const response = await client.path("/chat/completions").post({
				body: {
					messages: data.body.messages.map((msg) => ({
						role: msg.role,
						content: msg.content,
					})) as any,
					temperature: data.body.temperature,
					top_p: data.body.top_p,
					max_tokens: data.body.max_tokens,
					model: data.body.model,
				},
			});

			// Check for errors
			if (isUnexpected(response)) {
				return c.json(
					{
						success: false,
						error: response.body.error
							? JSON.stringify(response.body.error)
							: "Unknown error occurred",
					},
					500,
				);
			}

			// Validate response structure
			if (
				!response.body.choices ||
				response.body.choices.length === 0 ||
				!response.body.choices[0].message?.content
			) {
				return c.json(
					{
						success: false,
						error: "Invalid response from AI service - no content returned",
					},
					500,
				);
			}

			// Return the response
			return c.json({
				success: true,
				result: {
					content: response.body.choices[0].message.content,
				},
			});
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : "Unknown error occurred";
			return c.json(
				{
					success: false,
					error: errorMessage,
				},
				500,
			);
		}
	}
}
