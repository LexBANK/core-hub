import { SELF } from "cloudflare:test";
import { describe, expect, it } from "vitest";

describe("Content endpoints integration tests", () => {
	it("GET /site-meta should return english SEO data by default", async () => {
		const response = await SELF.fetch("http://local.test/site-meta");
		const body = await response.json<{ success: boolean; result: any }>();

		expect(response.status).toBe(200);
		expect(body.success).toBe(true);
		expect(body.result.locale).toBe("en");
		expect(body.result.title).toContain("CoreHub");
		expect(body.result.canonicalUrl).toBe("https://corehub.nexus");
	});

	it("GET /faq should return arabic items when requested", async () => {
		const response = await SELF.fetch("http://local.test/faq", {
			headers: {
				"Accept-Language": "ar;q=1,en;q=0.5",
			},
		});
		const body = await response.json<{ success: boolean; result: any }>();

		expect(response.status).toBe(200);
		expect(body.result.locale).toBe("ar");
		expect(body.result.items.length).toBeGreaterThan(0);
		expect(body.result.items[0].question).toContain("كيف");
	});
});
