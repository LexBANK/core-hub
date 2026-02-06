import { describe, expect, it, vi } from "vitest";
import worker from "../backend/worker";

const createEnv = () => ({
  COREHUB_KV: { put: vi.fn().mockResolvedValue(undefined) },
  COREHUB_DB: {
    prepare: vi.fn().mockReturnValue({
      bind: vi.fn().mockReturnValue({ run: vi.fn().mockResolvedValue({ success: true }) }),
    }),
  },
});

describe("/api/chat", () => {
  it("returns 400 when message is missing", async () => {
    const env = createEnv() as any;
    const req = new Request("http://localhost/api/chat", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({}),
    });

    const res = await worker.fetch(req, env, {} as ExecutionContext);
    expect(res.status).toBe(400);
  });

  it("returns reply when message is valid", async () => {
    const env = createEnv() as any;
    const req = new Request("http://localhost/api/chat", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ message: "مرحبا" }),
    });

    const res = await worker.fetch(req, env, {} as ExecutionContext);
    const data = (await res.json()) as { reply: string };

    expect(res.status).toBe(200);
    expect(data.reply).toContain("مرحبا");
    expect(env.COREHUB_KV.put).toHaveBeenCalledTimes(1);
    expect(env.COREHUB_DB.prepare).toHaveBeenCalledTimes(1);
  });
});
