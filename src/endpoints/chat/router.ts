import { Hono } from "hono";
import { fromHono } from "chanfana";
import { ChatCompletion } from "./chatCompletion";

export const chatRouter = fromHono(new Hono());

chatRouter.post("/", ChatCompletion);
