export async function logAudit(
	db: D1Database,
	action: string,
	actor: string,
	detail?: string,
): Promise<void> {
	await db
		.prepare(
			"INSERT INTO audit_log (action, actor, detail) VALUES (?, ?, ?)",
		)
		.bind(action, actor, detail ?? null)
		.run();
}
