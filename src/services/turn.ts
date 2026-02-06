export interface TurnEnv {
	TURN_TOKEN_ID: string;
	TURN_API_TOKEN: string;
}

export interface IceServer {
	urls: string[];
	username: string;
	credential: string;
}

export interface TurnCredentials {
	iceServers: IceServer[];
}

/**
 * Filter out port 53 URLs that cause browser timeouts.
 */
function filterPort53(iceServers: IceServer[]): IceServer[] {
	return iceServers.map((server) => ({
		...server,
		urls: server.urls.filter((url) => !url.includes(":53")),
	}));
}

export async function generateTurnCredentials(
	env: TurnEnv,
	ttl = 86400,
): Promise<TurnCredentials> {
	const response = await fetch(
		`https://rtc.live.cloudflare.com/v1/turn/keys/${env.TURN_TOKEN_ID}/credentials/generate-ice-servers`,
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

	const data = (await response.json()) as TurnCredentials;
	data.iceServers = filterPort53(data.iceServers);

	return data;
}
