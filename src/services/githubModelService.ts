import { createChatCompletion } from "../repos/githubModelsRepo";

const DEFAULT_SYSTEM_PROMPT =
	"You are a concise and helpful assistant. Answer clearly and safely.";
const DEFAULT_MODEL = "meta/Llama-4-Scout-17B-16E-Instruct";

export async function askGithubModel(env: Env, prompt: string): Promise<string> {
	const token = env.GITHUB_TOKEN;
	if (!token) {
		throw new Error("GitHub model token is not configured");
	}

	const trimmedPrompt = prompt.trim();
	if (!trimmedPrompt) {
		throw new Error("Prompt must not be empty");
	}

	return createChatCompletion(token, DEFAULT_MODEL, [
		{ role: "system", content: DEFAULT_SYSTEM_PROMPT },
		{ role: "user", content: trimmedPrompt },
	]);
}
