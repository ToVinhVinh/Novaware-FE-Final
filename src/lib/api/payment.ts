import { sendGet, sendPost } from "./axios";
import { ICreatePaymentIntentResponse } from "../../interface/request/payment";
import { ICreatePaymentIntentBody } from "../../interface/request/payment";

export const getPayPalClientId = async (): Promise<string> => {
	return await sendGet(`/config/paypal`);
};

export const createPaymentIntent = async (body: ICreatePaymentIntentBody): Promise<ICreatePaymentIntentResponse> => {
	return await sendPost(`/create-payment-intent`, body);
};

