import { Hono } from "hono";

const chatRouter = new Hono<{ Bindings: Env }>();

chatRouter.post("/", async (c) => {
	const apiKey = c.env.OPENAI_API_KEY;
	if (!apiKey) {
		return c.json({ error: "OPENAI_API_KEY is not configured" }, 500);
	}

	let body: { messages?: { role: string; content: string }[] };
	try {
		body = await c.req.json();
	} catch {
		return c.json({ error: "Invalid JSON body" }, 400);
	}

	const messages = body.messages;
	if (!Array.isArray(messages) || messages.length === 0) {
		return c.json({ error: "messages array is required" }, 400);
	}

	// Validate message format
	for (const msg of messages) {
		if (!msg.role || !msg.content) {
			return c.json({ error: "Each message must have role and content" }, 400);
		}
	}

	try {
		const response = await fetch(
			"https://api.openai.com/v1/chat/completions",
			{
				method: "POST",
				headers: {
					Authorization: `Bearer ${apiKey}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					model: "gpt-4o-mini",
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
			},
		);

		if (!response.ok) {
			const err = await response.json().catch(() => ({}));
			console.error("OpenAI API error:", JSON.stringify(err));
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
