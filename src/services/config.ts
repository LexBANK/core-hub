export async function getConfig(
	db: D1Database,
	key: string,
): Promise<string | null> {
	const row = await db
		.prepare("SELECT value FROM config WHERE key = ?")
		.bind(key)
		.first<{ value: string }>();
	return row?.value ?? null;
}

export async function setConfig(
	db: D1Database,
	key: string,
	value: string,
): Promise<void> {
	await db
		.prepare(
			"INSERT INTO config (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP) ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP",
		)
		.bind(key, value)
		.run();
}
