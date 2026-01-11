export interface ICreatePaymentIntentBody {
	totalPrice: number;
}

export interface ICreatePaymentIntentResponse {
	clientSecret: string;
}

