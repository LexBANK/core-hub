import { Hono } from "hono";
import { fromHono } from "chanfana";
import { McpStatus } from "./mcpStatus";

export const mcpRouter = fromHono(new Hono());

mcpRouter.get("/", McpStatus);
