import { useMutation } from '@tanstack/react-query';
import {
	register,
	login,
	forgotPassword,
	verifyCode,
	resetPassword,
	resetPasswordByUserId,
} from '../../lib/api/auth';
import * as AuthTypes from '../../interface/response/auth';
import * as AuthRequestTypes from '../../interface/request/auth';

// Register
export const useRegister = () => {
	return useMutation<AuthTypes.IRegisterResponse, Error, AuthRequestTypes.IRegisterBody>({
		mutationFn: register,
	});
};

// Login
export const useLogin = () => {
	return useMutation<AuthTypes.ILoginResponse, Error, AuthRequestTypes.ILoginBody>({
		mutationFn: login,
	});
};

// Forgot Password
export const useForgotPassword = () => {
	return useMutation<AuthTypes.IForgotPasswordResponse, Error, AuthRequestTypes.IForgotPasswordBody>({
		mutationFn: forgotPassword,
	});
};

// Verify Code
export const useVerifyCode = () => {
	return useMutation<AuthTypes.IVerifyCodeResponse, Error, AuthRequestTypes.IVerifyCodeBody>({
		mutationFn: verifyCode,
	});
};

// Reset Password
export const useResetPassword = () => {
	return useMutation<AuthTypes.IResetPasswordResponse, Error, { body: AuthRequestTypes.IResetPasswordBody; resetToken?: string }>({
		mutationFn: ({ body, resetToken }) => resetPassword(body, resetToken),
	});
};

// Reset Password By User ID
export const useResetPasswordByUserId = () => {
	return useMutation<AuthTypes.IResetPasswordByUserIdResponse, Error, AuthRequestTypes.IResetPasswordByUserIdBody>({
		mutationFn: resetPasswordByUserId,
	});
};

