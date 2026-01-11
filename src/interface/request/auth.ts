export interface IRegisterBody {
	name: string;
	email: string;
	password: string;
}

export interface ILoginBody {
	email: string;
	password: string;
}

export interface IForgotPasswordBody {
	email: string;
}

export interface IVerifyCodeBody {
	email: string;
	code: string;
}

export interface IResetPasswordBody {
	password: string;
}

export interface IResetPasswordByUserIdBody {
	userId: string;
	newPassword: string;
}

