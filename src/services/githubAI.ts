import OpenAI from "openai";

export interface GitHubAIEnv {
	GITHUB_TOKEN: string;
	GITHUB_AI_ENDPOINT: string;
	GITHUB_AI_MODEL: string;
}

export function createGitHubAIClient(env: GitHubAIEnv): OpenAI {
	return new OpenAI({
		baseURL: env.GITHUB_AI_ENDPOINT,
		apiKey: env.GITHUB_TOKEN,
	});
}

export async function chatCompletion(
	client: OpenAI,
	model: string,
	systemPrompt: string,
	userMessage: string,
): Promise<string | null> {
	const response = await client.chat.completions.create({
		messages: [
			{ role: "system", content: systemPrompt },
			{ role: "user", content: userMessage },
		],
		model,
	});

	return response.choices[0]?.message?.content ?? null;
}
