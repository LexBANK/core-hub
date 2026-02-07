import { ApiException, fromHono } from "chanfana";
import { Hono } from "hono";
import { tasksRouter } from "./endpoints/tasks/router";
import { ContentfulStatusCode } from "hono/utils/http-status";
import { DummyEndpoint } from "./endpoints/dummyEndpoint";
import { localize, resolveLocale } from "./i18n";
import { SiteMetaEndpoint } from "./endpoints/content/siteMeta";
import { FaqEndpoint } from "./endpoints/content/faq";

// Start a Hono app
const app = new Hono<{ Bindings: Env }>();

app.onError((err, c) => {
	const locale = resolveLocale(c.req.header("accept-language"));

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
			errors: [
				{
					code: 7000,
					message: localize(
						{
							en: "Internal Server Error",
							ar: "خطأ داخلي في الخادم",
						},
						locale,
					),
				},
			],
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
			description:
				"CoreHub unified API surface for docs, status, endpoints, localized content, and integration support.",
			contact: {
				name: "CoreHub API Support",
				url: "https://corehub.nexus",
			},
		},
	},
});

// Register Tasks Sub router
openapi.route("/tasks", tasksRouter);

// Register content endpoints
openapi.get("/site-meta", SiteMetaEndpoint);
openapi.get("/faq", FaqEndpoint);

// Register other endpoints
openapi.post("/dummy/:slug", DummyEndpoint);

// Export the Hono app
export default app;
