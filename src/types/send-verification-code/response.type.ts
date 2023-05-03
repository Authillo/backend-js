import { SEND_VERIFICATION_CODE_ERROR_CODES } from "./errorcodes";
export interface SEND_VERIFICATION_CODE_RESPONSE {
	result:
		| {
				succeeded: true;
				feedback: SUCCEEDED_SEND_VERIFICATION_CODE_FEEDBACK;
				code?: string;
				state?: string;
		  }
		| { succeeded: false; feedback: FAILED_SEND_VERIFICATION_CODE_FEEDBACK };
	errObj?: any;
}

export interface FAILED_SEND_VERIFICATION_CODE_FEEDBACK {
	customCode: SEND_VERIFICATION_CODE_ERROR_CODES;
}
export interface SUCCEEDED_SEND_VERIFICATION_CODE_FEEDBACK {
	linkSent: boolean;
	destination: string;
	verificationSessionId: string;
}
