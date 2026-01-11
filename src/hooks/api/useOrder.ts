import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
	createOrder,
	getOrders,
	getOrder,
	getMyOrders,
	updateOrderToPaid,
	updateOrderToDelivered,
	cancelOrder,
	confirmOrder,
} from '../../lib/api/order';
import * as OrderTypes from '../../interface/response/order';
import * as OrderRequestTypes from '../../interface/request/order';

// Queries
export const useGetOrders = (query?: OrderRequestTypes.IGetOrdersQuery) => {
	return useQuery<OrderTypes.IGetOrdersResponse, Error>({
		queryKey: ['orders', 'list', query],
		queryFn: () => getOrders(query),
	});
};

export const useGetOrder = (id: string) => {
	return useQuery<OrderTypes.IGetOrderResponse, Error>({
		queryKey: ['orders', 'detail', id],
		queryFn: () => getOrder(id),
		enabled: !!id,
	});
};

export const useGetMyOrders = (query?: OrderRequestTypes.IGetOrdersQuery) => {
	return useQuery<OrderTypes.IGetOrdersResponse, Error>({
		queryKey: ['orders', 'my-orders', query],
		queryFn: () => getMyOrders(query),
	});
};

// Mutations
export const useCreateOrder = () => {
	const queryClient = useQueryClient();

	return useMutation<OrderTypes.ICreateOrderResponse, Error, OrderRequestTypes.ICreateOrderBody>({
		mutationFn: createOrder,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['orders'] });
		},
	});
};

export const useUpdateOrderToPaid = () => {
	const queryClient = useQueryClient();

	return useMutation<
		OrderTypes.IUpdateOrderToPaidResponse,
		Error,
		{ id: string; body: OrderRequestTypes.IUpdateOrderToPaidBody }
	>({
		mutationFn: ({ id, body }) => updateOrderToPaid(id, body),
		onSuccess: (data, variables) => {
			queryClient.invalidateQueries({ queryKey: ['orders', 'detail', variables.id] });
			queryClient.invalidateQueries({ queryKey: ['orders'] });
		},
	});
};

export const useUpdateOrderToDelivered = () => {
	const queryClient = useQueryClient();

	return useMutation<OrderTypes.IUpdateOrderToDeliveredResponse, Error, string>({
		mutationFn: updateOrderToDelivered,
		onSuccess: (data, variables) => {
			queryClient.invalidateQueries({ queryKey: ['orders', 'detail', variables] });
			queryClient.invalidateQueries({ queryKey: ['orders'] });
		},
	});
};

export const useCancelOrder = () => {
	const queryClient = useQueryClient();

	return useMutation<OrderTypes.ICancelOrderResponse, Error, string>({
		mutationFn: cancelOrder,
		onSuccess: (data, variables) => {
			queryClient.invalidateQueries({ queryKey: ['orders', 'detail', variables] });
			queryClient.invalidateQueries({ queryKey: ['orders'] });
		},
	});
};

export const useConfirmOrder = () => {
	const queryClient = useQueryClient();

	return useMutation<OrderTypes.IConfirmOrderResponse, Error, string>({
		mutationFn: confirmOrder,
		onSuccess: (data, variables) => {
			queryClient.invalidateQueries({ queryKey: ['orders', 'detail', variables] });
			queryClient.invalidateQueries({ queryKey: ['orders'] });
		},
	});
};

