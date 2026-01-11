export interface IUser {
	_id: string;
	name: string;
	email: string;
	isAdmin: boolean;
}

export interface IRegisterResponse {
	message: string;
	data: IUser;
}

export interface IAuthTokens {
	refresh: string;
	access: string;
}

export interface ILoginResponse {
	status: string;
	message: string;
	data: {
		tokens: IAuthTokens;
	};
}

export interface IForgotPasswordResponse {
	message: string;
}

export interface IVerifyCodeResponse {
	message: string;
	data: {
		resetToken: string;
	};
}

export interface IResetPasswordResponse {
	message: string;
}

export interface IResetPasswordByUserIdResponse {
	message: string;
}

