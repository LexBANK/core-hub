import { ApiException, fromHono } from "chanfana";
import { Hono } from "hono";
import { tasksRouter } from "./endpoints/tasks/router";
import { chatRouter } from "./endpoints/chat/router";
import { turnRouter } from "./endpoints/turn/router";
import { adminRouter } from "./endpoints/admin/router";
import { mcpRouter } from "./endpoints/mcp/router";
import { ContentfulStatusCode } from "hono/utils/http-status";
import { DummyEndpoint } from "./endpoints/dummyEndpoint";
import { getConfig } from "./services/config";

// Start a Hono app
const app = new Hono<{ Bindings: Env }>();

// OpenAI domain verification (plain text, outside OpenAPI)
app.get("/.well-known/openai-apps-challenge", async (c) => {
	const token = await getConfig(c.env.DB, "openai_verification_token");
	if (!token) {
		return c.text("not-configured", 404);
	}
	return c.text(token);
});

app.onError((err, c) => {
	if (err instanceof ApiException) {
		// If it's a Chanfana ApiException, let Chanfana handle the response
		return c.json(
			{ success: false, errors: err.buildResponse() },
			err.status as ContentfulStatusCode,
		);
	}

	console.error("Global error handler caught:", err); // Log the error if it's not known

	// For other errors, return a generic 500 response
	return c.json(
		{
			success: false,
			errors: [{ code: 7000, message: "Internal Server Error" }],
		},
		500,
	);
});

// Setup OpenAPI registry
const openapi = fromHono(app, {
	docs_url: "/",
	schema: {
		info: {
			title: "CoreHub API",
			version: "2.1.0",
			description: "CoreHub Admin & MCP API with WebRTC TURN support.",
		},
	},
});

// Register Tasks Sub router
openapi.route("/tasks", tasksRouter);

// Register Chat Sub router
openapi.route("/chat", chatRouter);

// Register TURN Sub router
openapi.route("/turn", turnRouter);

// Register Admin Sub router
openapi.route("/admin", adminRouter);

// Register MCP Sub router
openapi.route("/mcp", mcpRouter);

// Register other endpoints
openapi.post("/dummy/:slug", DummyEndpoint);

// Export the Hono app
export default app;
