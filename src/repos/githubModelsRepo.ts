const INFERENCE_ENDPOINT = "https://models.github.ai/inference/chat/completions";

export type ChatCompletionMessage = {
	role: "system" | "user";
	content: string;
};

type GithubInferenceResponse = {
	choices?: Array<{
		message?: {
			content?: string;
		};
	}>;
	error?: {
		message?: string;
	};
};

export async function createChatCompletion(
	token: string,
	model: string,
	messages: ChatCompletionMessage[],
): Promise<string> {
	const response = await fetch(INFERENCE_ENDPOINT, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			model,
			messages,
			temperature: 0.8,
			top_p: 0.9,
			max_tokens: 512,
		}),
	});

	const body = (await response.json()) as GithubInferenceResponse;

	if (!response.ok) {
		throw new Error(body.error?.message ?? "Inference request failed");
	}

	const message = body.choices?.[0]?.message?.content?.trim();
	if (!message) {
		throw new Error("Inference response did not include a completion message");
	}

	return message;
}
