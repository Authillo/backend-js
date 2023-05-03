import { SEND_VERIFICATION_LINK_ERROR_CODES } from "./errorcodes";
export interface SEND_VERIFICATION_LINK_RESPONSE {
	result:
		| {
				succeeded: true;
				feedback: SUCCEEDED_SEND_VERIFICATION_LINK_FEEDBACK;
				code?: string;
				state?: string;
		  }
		| { succeeded: false; feedback: FAILED_SEND_VERIFICATION_LINK_FEEDBACK };
	errObj?: any;
}

export interface FAILED_SEND_VERIFICATION_LINK_FEEDBACK {
	customCode: SEND_VERIFICATION_LINK_ERROR_CODES;
}
export interface SUCCEEDED_SEND_VERIFICATION_LINK_FEEDBACK {
	linkSent: boolean;
	destination: string;
	verificationSessionId: string;
}
