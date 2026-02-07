import chatRoute from "./routes/chat";

export interface Env {
  COREHUB_DB: D1Database;
  COREHUB_KV: KVNamespace;
  ENV?: string;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/api/chat" && request.method === "POST") {
      return chatRoute.handle(request, env, ctx);
    }

    return new Response("corehub.nexsus — API", { status: 200 });
  },
};
