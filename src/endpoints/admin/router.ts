import { Hono } from "hono";
import { fromHono } from "chanfana";
import { SetVerificationToken } from "./setVerificationToken";

export const adminRouter = fromHono(new Hono());

adminRouter.post("/set-verification-token", SetVerificationToken);
