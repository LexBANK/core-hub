import { SELF } from "cloudflare:test";
import { beforeEach, describe, expect, it, vi } from "vitest";

describe("Dummy API Integration Tests", () => {
	beforeEach(async () => {
		vi.clearAllMocks();
	});

	describe("POST /dummy/{slug}", () => {
		it("should return default english details", async () => {
			const slug = "test-slug";
			const requestBody = { name: "Test Name" };
			const response = await SELF.fetch(`http://local.test/dummy/${slug}`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(requestBody),
			});
			const body = await response.json<{ success: boolean; result: any }>();

			expect(response.status).toBe(200);
			expect(body.success).toBe(true);
			expect(body.result.slug).toBe(slug);
			expect(body.result.name).toBe(requestBody.name);
			expect(body.result.locale).toBe("en");
			expect(body.result.msg).toContain("dummy endpoint");
		});

		it("should return arabic details when Accept-Language is arabic", async () => {
			const response = await SELF.fetch("http://local.test/dummy/test-slug", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Accept-Language": "ar-SA,ar;q=0.9,en;q=0.8",
				},
				body: JSON.stringify({ name: "اسم" }),
			});
			const body = await response.json<{ success: boolean; result: any }>();

			expect(response.status).toBe(200);
			expect(body.result.locale).toBe("ar");
			expect(body.result.msg).toContain("تجريبية");
		});
	});
});
