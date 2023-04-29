import { TOKEN_RESPONSE } from "./types/token";

import * as crypto from "crypto";
import fetch from "node-fetch";

export const generateCodeChallengeAndCodeVerifier = () => {
	const codeVerifier = crypto.randomBytes(32).toString("base64url");
	const codeChallenge = crypto.createHash("sha256").update(codeVerifier).digest("base64url");
	return { codeVerifier, codeChallenge };
};

export const tokenRequest = async (
	client_id: string,
	client_secret: string,
	code: string,
	redirect_uri: string,
	code_verifier: string
) => {
	const url = `https://auth.authillo.com/token?grant_type=authorization_code&code=${code}&redirect_uri=${redirect_uri}&code_verifier=${code_verifier}&client_id=${client_id}&client_secret=${client_secret}&request_type=OIDC`;
	const tokenRes = await fetch(url, {
		method: "POST",
	});
	const parsed = await tokenRes.json();
	return parsed as TOKEN_RESPONSE;
};
