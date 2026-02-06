import { Hono } from "hono";
import { fromHono } from "chanfana";
import { TurnCredentials } from "./turnCredentials";

export const turnRouter = fromHono(new Hono());

turnRouter.post("/credentials", TurnCredentials);
