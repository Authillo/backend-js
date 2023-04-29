import { ParsedIdToken, TOKEN_ERROR_CODES, TOKEN_RESPONSE } from "./types/token";

import * as crypto from "crypto";
import fetch from "node-fetch";
import * as jwt from "jsonwebtoken";
/**
 * @param {string} clientId - Unique identifier of your app - for a full explanation of this parameter, visit https://authillo.com/docs/backend/clientId
 * @param {string} clientSecret - Secret Code for your app - for a full explanation of this parameter, visit https://authillo.com/docs/backend/clientSecret
 * @param {string} jwtKey - secret key used to validate the ID token received in the token response to ensure the id token was issued by Authillo and hasn't been modified in any way - for a full explanation of this parameter, visit https://authillo.com/docs/backend/jwtKey
 * @param {boolean} [enforceStrictSecurity=false] - Flag, which if set, will require the code_verifier flow - for a full explanation of this parameter, visit https://authillo.com/docs/backend/enforceStrictSecurity
 * @param {boolean} [enableLogs=true] - Flag, which enables output of authillo console logs (defaults to true)
 */
export type config = {
	clientId: string;
	clientSecret: string;
	jwtKey: string;
	enforceStrictSecurity?: boolean;
	enableLogs?: boolean;
};
class authillo {
	private clientId?: string;
	private clientSecret?: string;
	private jwtKey?: string;
	private enforceStrictSecurity: boolean = false;
	private enableLogs: boolean = true;
	private _initializationIsValid() {
		return this.clientId != null && this.clientSecret != null && this.jwtKey != null;
	}
	private _log = (content: any) => {
		if (this.enableLogs) console.log(content);
	};
	private _getUnsafeCodeChallengeAndCodeVerifierPair = () => {
		return new Promise<{ unsafeCodeVerifier: string; unsafeCodeChallenge: string }>(() => {
			// TODO- generate a hashed version
			const unsafeCodeVerifier = "unsafeCodeVerifier";
			const unsafeCodeChallenge = crypto
				.createHash("sha256")
				.update(unsafeCodeVerifier)
				.digest("base64url");
			return { unsafeCodeChallenge, unsafeCodeVerifier };
		});
	};
	constructor() {}
	public initialize(config: config) {
		this.clientId = config.clientId;
		this.clientSecret = config.clientSecret;
		this.jwtKey = config.jwtKey;
		if (config.enforceStrictSecurity != null)
			this.enforceStrictSecurity = config.enforceStrictSecurity;
		if (config.enableLogs != null) this.enableLogs = config.enableLogs;
	}
	public generateCodeChallengeAndCodeVerifierPair = () => {
		const codeVerifier = crypto.randomBytes(32).toString("base64url");
		const codeChallenge = crypto.createHash("sha256").update(codeVerifier).digest("base64url");
		return { codeVerifier, codeChallenge };
	};
	public tokenRequest = async (
		code: string,
		redirect_uri: string,
		code_verifier?: string
	): Promise<TOKEN_RESPONSE & { parsedIdToken?: ParsedIdToken }> => {
		if (!this._initializationIsValid())
			throw `invalid configuration -- [make sure .initialize() is run before calling .tokenRequest()]`;
		if (code_verifier == null) {
			if (this.enforceStrictSecurity === true)
				throw "missing code_verifier parameter: code_verifier parameter must be provided when enforceStrictSecurity is set to true";
			code_verifier = await this._getUnsafeCodeChallengeAndCodeVerifierPair()
				.then((unsafeResult) => unsafeResult.unsafeCodeVerifier)
				.catch((reason) => {
					this._log(
						`failed to get unsafe codeChallenge and codeVerifier pair for following reason: ${reason}`
					);
					throw reason;
				});
		}
		const url = `https://auth.authillo.com/token?grant_type=authorization_code&code=${code}&redirect_uri=${redirect_uri}&code_verifier=${code_verifier}&client_id=${this.clientId}&client_secret=${this.clientSecret}&request_type=OIDC`;
		this._log("executing POST request to authillo's token endpoint");
		const tokenRes = await fetch(url, {
			method: "POST",
		});
		this._log("parsing response from token request");
		const parsed = (await tokenRes.json()) as TOKEN_RESPONSE;
		if (parsed.result.succeeded !== true) {
			this._log(
				`token request failed with error: ${parsed.result?.feedback?.customCode} & message: ${parsed.result?.feedback?.customCode}`
			);
			return parsed;
		}
		this._log("verifying id_token");
		try {
			const parsedIdToken = jwt.verify(
				parsed.result.feedback.id_token,
				this.jwtKey!
			) as any as ParsedIdToken;
			this._log("id_token is valid");
			return { ...parsed, parsedIdToken };
		} catch (e) {
			return {
				result: { succeeded: false, feedback: { customCode: TOKEN_ERROR_CODES.INVALID_ID_TOKEN } },
			};
		}
	};
}
