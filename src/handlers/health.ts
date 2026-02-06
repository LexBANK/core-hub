import { Hono } from 'hono'

export const healthHandler = new Hono().get('/health', (c) => {
  return c.json({ status: 'ok' })
})
