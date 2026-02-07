interface ExecutionContext {}

interface D1PreparedStatement {
  bind(...values: unknown[]): { run(): Promise<unknown> };
}

interface D1Database {
  prepare(query: string): D1PreparedStatement;
}

interface KVNamespace {
  put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>;
}

interface Env {
  COREHUB_DB: D1Database;
  COREHUB_KV: KVNamespace;
  ENV?: string;
}
