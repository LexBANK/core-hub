export interface TurnEnv {
	TURN_TOKEN_ID: string;
	TURN_API_TOKEN: string;
}

export interface TurnCredentials {
	iceServers: {
		urls: string[];
		username: string;
		credential: string;
	}[];
}

export async function generateTurnCredentials(
	env: TurnEnv,
	ttl = 86400,
): Promise<TurnCredentials> {
	const response = await fetch(
		`https://rtc.live.cloudflare.com/v1/turn/keys/${env.TURN_TOKEN_ID}/credentials/generate`,
		{
			method: "POST",
			headers: {
				Authorization: `Bearer ${env.TURN_API_TOKEN}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ ttl }),
		},
	);

	if (!response.ok) {
		throw new Error(
			`Failed to generate TURN credentials: ${response.status} ${response.statusText}`,
		);
	}

	return response.json() as Promise<TurnCredentials>;
}
