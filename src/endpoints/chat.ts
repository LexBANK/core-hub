import { Hono } from "hono";

interface ProviderConfig {
	apiUrl: string;
	model: string;
	apiKey: string;
}

const chatRouter = new Hono<{ Bindings: Env }>();

function getProvider(
	provider: string,
	env: Env,
): ProviderConfig | { error: string } {
	switch (provider) {
		case "openai":
			if (!env.OPENAI_API_KEY)
				return { error: "OPENAI_API_KEY is not configured" };
			return {
				apiUrl: "https://api.openai.com/v1/chat/completions",
				model: "gpt-4o-mini",
				apiKey: env.OPENAI_API_KEY,
			};
		case "perplexity":
			if (!env.PERPLEXITY_API_KEY)
				return { error: "PERPLEXITY_API_KEY is not configured" };
			return {
				apiUrl: "https://api.perplexity.ai/chat/completions",
				model: "sonar",
				apiKey: env.PERPLEXITY_API_KEY,
			};
		default:
			return { error: `Unknown provider: ${provider}` };
	}
}

chatRouter.post("/", async (c) => {
	let body: {
		messages?: { role: string; content: string }[];
		provider?: string;
	};
	try {
		body = await c.req.json();
	} catch {
		return c.json({ error: "Invalid JSON body" }, 400);
	}

	const messages = body.messages;
	if (!Array.isArray(messages) || messages.length === 0) {
		return c.json({ error: "messages array is required" }, 400);
	}

	for (const msg of messages) {
		if (!msg.role || !msg.content) {
			return c.json(
				{ error: "Each message must have role and content" },
				400,
			);
		}
	}

	const providerName = body.provider || "openai";
	const config = getProvider(providerName, c.env);

	if ("error" in config) {
		return c.json({ error: config.error }, 500);
	}

	try {
		const response = await fetch(config.apiUrl, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${config.apiKey}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				model: config.model,
				messages: [
					{
						role: "system",
						content:
							"You are a helpful assistant for LexBANK. Respond in the same language the user writes in. Be concise and helpful.",
					},
					...messages,
				],
				max_tokens: 2048,
				temperature: 0.7,
			}),
		});

		if (!response.ok) {
			const err = await response.json().catch(() => ({}));
			console.error(`${providerName} API error:`, JSON.stringify(err));
			return c.json(
				{ error: "Failed to get response from AI model" },
				502,
			);
		}

		const data = (await response.json()) as {
			choices: { message: { content: string } }[];
		};
		const reply = data.choices?.[0]?.message?.content ?? "";

		return c.json({ reply });
	} catch (err) {
		console.error("Chat endpoint error:", err);
		return c.json({ error: "Internal server error" }, 500);
	}
});

export { chatRouter };
