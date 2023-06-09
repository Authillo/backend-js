import { TOKEN_ERROR_CODES } from "./errorcodes";

export interface TOKEN_RESPONSE {
	result:
		| {
				succeeded: true;
				feedback: SUCCEEDED_TOKEN_FEEDBACK;
		  }
		| { succeeded: false; feedback: FAILED_TOKEN_FEEDBACK };
}

export interface FAILED_TOKEN_FEEDBACK {
	customCode: TOKEN_ERROR_CODES;
	message?: string;
}
export interface SUCCEEDED_TOKEN_FEEDBACK {
	access_token: string;
	token_type: string;
	id_token: string;
	expires_in?: number;
	refresh_token?: string;
	scope?: string;
}

export interface ParsedIdToken {
	iss: string;
	sub: string;
	aud: string;
	exp: string;
	iat: string;
	auth_time: string;
}
