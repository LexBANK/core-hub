import type { Env } from "../worker";
import { jsonResponse } from "../lib/stream";

interface ChatRequestBody {
  message?: unknown;
}

export default {
  async handle(request: Request, env: Env, _ctx?: ExecutionContext): Promise<Response> {
    const body = (await request.json().catch(() => ({}))) as ChatRequestBody;
    const userMessage = typeof body.message === "string" ? body.message.trim() : "";

    if (!userMessage) {
      return jsonResponse({ error: "message is required" }, 400);
    }

    const now = new Date().toISOString();
    const logKey = `chat:last:${crypto.randomUUID()}`;

    await env.COREHUB_KV.put(
      logKey,
      JSON.stringify({ role: "user", content: userMessage, createdAt: now }),
      { expirationTtl: 60 * 60 },
    );

    const reply = `مرحباً، هذه استجابة تجريبية من corehub.nexsus. رسالتك كانت: ${userMessage}`;

    await env.COREHUB_DB.prepare(
      "INSERT INTO chat_messages (role, content, created_at) VALUES (?, ?, ?)",
    )
      .bind("assistant", reply, now)
      .run();

    return jsonResponse({ reply });
  },
};
