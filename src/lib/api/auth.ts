import axios from "axios";
import cookies from "js-cookie";
import { sendPost, sendPut } from "./axios";
import {
	IRegisterResponse,
	ILoginResponse,
	IForgotPasswordResponse,
	IVerifyCodeResponse,
	IResetPasswordResponse,
	IResetPasswordByUserIdResponse,
	IAuthTokens,
} from "../../interface/response/auth";
import {
	IRegisterBody,
	ILoginBody,
	IForgotPasswordBody,
	IVerifyCodeBody,
	IResetPasswordBody,
	IResetPasswordByUserIdBody,
} from "../../interface/request/auth";

// Register
export const register = async (body: IRegisterBody): Promise<IRegisterResponse> => {
	return await sendPost(`/auth/register`, body);
};

// Login
function persistAuthTokens(tokens?: IAuthTokens) {
	if (!tokens || typeof window === "undefined") {
		return;
	}

	const { access, refresh } = tokens;

	if (access) {
		localStorage.setItem("accessToken", access);
		localStorage.setItem("access_token", access);
		localStorage.setItem("token", JSON.stringify({ token: access, refreshToken: refresh || null }));
		cookies.set("accessToken", access);
	}

	if (refresh) {
		localStorage.setItem("refreshToken", refresh);
		cookies.set("refreshToken", refresh);
	}

	const userInfoRaw = localStorage.getItem("userInfo");
	if (userInfoRaw && userInfoRaw !== "{}") {
		try {
			const userInfo = JSON.parse(userInfoRaw);
			const updatedUserInfo = {
				...userInfo,
				token: access || userInfo?.token,
				accessToken: access || userInfo?.accessToken,
			};
			localStorage.setItem("userInfo", JSON.stringify(updatedUserInfo));
		} catch {
			// If parsing fails, replace with minimal token info
			localStorage.setItem("userInfo", JSON.stringify({ token: access }));
		}
	}
}

export const login = async (body: ILoginBody): Promise<ILoginResponse> => {
	const response = await sendPost(`/auth/login`, body);
	if (response?.data?.tokens) {
		persistAuthTokens(response.data.tokens);
	}
	return response;
};

// Forgot Password
export const forgotPassword = async (body: IForgotPasswordBody): Promise<IForgotPasswordResponse> => {
	return await sendPost(`/auth/forgot-password`, body);
};

// Verify Code
export const verifyCode = async (body: IVerifyCodeBody): Promise<IVerifyCodeResponse> => {
	return await sendPost(`/auth/verify-code`, body);
};

// Reset Password (with resetToken in Authorization header)
export const resetPassword = async (body: IResetPasswordBody, resetToken?: string): Promise<IResetPasswordResponse> => {
	const baseURL = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api`;
	const config: any = {
		headers: {
			"Content-Type": "application/json",
		},
	};

	if (resetToken) {
		config.headers["Authorization"] = `Bearer ${resetToken}`;
	}

	const response = await axios.put(`${baseURL}/auth/reset-password`, body, config);
	return response?.data;
};

// Reset Password By User ID
export const resetPasswordByUserId = async (body: IResetPasswordByUserIdBody): Promise<IResetPasswordByUserIdResponse> => {
	return await sendPost(`/auth/reset-password-by-user-id`, body);
};

