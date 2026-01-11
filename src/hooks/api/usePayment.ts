import { useQuery, useMutation } from '@tanstack/react-query';
import {
	getPayPalClientId,
	createPaymentIntent,
} from '../../lib/api/payment';
import { ICreatePaymentIntentResponse } from '../../interface/request/payment';
import { ICreatePaymentIntentBody } from '../../interface/request/payment';

export const useGetPayPalClientId = () => {
	return useQuery<string, Error>({
		queryKey: ['payment', 'paypal-client-id'],
		queryFn: getPayPalClientId,
	});
};

export const useCreatePaymentIntent = () => {
	return useMutation<ICreatePaymentIntentResponse, Error, ICreatePaymentIntentBody>({
		mutationFn: createPaymentIntent,
	});
};

