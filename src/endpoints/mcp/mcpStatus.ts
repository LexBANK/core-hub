import { contentJson, OpenAPIRoute } from "chanfana";
import { z } from "zod";

export class McpStatus extends OpenAPIRoute {
	public schema = {
		tags: ["MCP"],
		summary: "MCP Server status and available tools",
		operationId: "mcp-status",
		responses: {
			"200": {
				description: "MCP Server status",
				...contentJson({
					success: Boolean,
					result: z.object({
						status: z.string(),
						tools: z.array(z.string()),
					}),
				}),
			},
		},
	};

	public async handle() {
		return {
			success: true,
			result: {
				status: "alive",
				tools: [
					"corehub_status",
					"list_routes",
					"set_openai_verification_token",
					"rotate_turn_credentials",
				],
			},
		};
	}
}
