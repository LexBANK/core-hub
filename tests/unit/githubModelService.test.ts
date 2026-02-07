import { afterEach, describe, expect, it, vi } from "vitest";
import { askGithubModel } from "../../src/services/githubModelService";

describe("askGithubModel", () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("throws when token is missing", async () => {
		await expect(
			askGithubModel({} as Env, "What is the capital of France?"),
		).rejects.toThrow("GitHub model token is not configured");
	});

	it("throws when prompt is empty", async () => {
		await expect(
			askGithubModel({ GITHUB_TOKEN: "token" } as Env, "  "),
		).rejects.toThrow("Prompt must not be empty");
	});

	it("returns model output when inference succeeds", async () => {
		vi.spyOn(globalThis, "fetch").mockResolvedValue(
			new Response(
				JSON.stringify({
					choices: [{ message: { content: "Paris" } }],
				}),
				{ status: 200 },
			),
		);

		await expect(
			askGithubModel({ GITHUB_TOKEN: "token" } as Env, "What is the capital of France?"),
		).resolves.toBe("Paris");
	});
});
