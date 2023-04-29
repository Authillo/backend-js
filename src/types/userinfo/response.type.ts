import { USERINFO_ERROR_CODES } from "./errorcodes";
export interface USERINFO_RESPONSE {
	result:
		| {
				succeeded: true;
				feedback: SUCCEEDED_USERINFO_FEEDBACK;
				code?: string;
				state?: string;
		  }
		| { succeeded: false; feedback: FAILED_USERINFO_FEEDBACK };
	errObj?: any;
}

export interface FAILED_USERINFO_FEEDBACK {
	customCode: USERINFO_ERROR_CODES;
	message?: string;
}
export interface SUCCEEDED_USERINFO_FEEDBACK {
	userAttributes: COMBINED_RESPONSE;
}

export interface COMBINED_RESPONSE {
	sub: string;
	name?: string;
	age?: number;
	birthdate?: string;
	phoneNumber?: string;
	phone_number?: string;
	sex?: "MALE" | "FEMALE";
	email?: string;
	riskScore?: number; //legacy
	phoneNumberData?: {
		type?: string;
	};
	faceResponse?: {
		faceVerified: boolean;
		faceVerificationMR: boolean;
		riskScore: number;
	};
	idPhotoResponse?: {
		hasLicense: boolean;
		parsedLicenseData?: {
			licenseNumber: string;
			firstName: string;
			lastName: string;
			idType: string;
			expirationDate: string;
			birthdate: string;
			state: string;
			zipCode: string;
			manuallyReviewed: Boolean;
		};
		licenseImageFront?: string;
		licenseImageBack?: string;
	};
	licenseResponse?: {
		hasLicense: boolean;
		parsedLicenseData?: {
			licenseNumber: string;
			firstName: string;
			lastName: string;
			idType: string;
			expirationDate: string;
			birthdate: string;
			state: string;
			zipCode: string;
			manuallyReviewed: Boolean;
		};
	};
	linkedinResponse?: {
		linkedinVerified: boolean;
		linkedinData?: {
			linkedinId: string;
			name: string;
			firstName: string;
			lastName: string;
			email: string;
			emailVerified: boolean;
			picture?: string;
			locale?: string;
		};
	};
	googleResponse?: {
		googleVerified: boolean;
		googleData?: {
			googleId: string;
			email?: string;
			emailVerified: boolean;
			name?: string;
			givenName?: string;
			familyName?: string;
			picture?: string;
		}[];
	};
}
