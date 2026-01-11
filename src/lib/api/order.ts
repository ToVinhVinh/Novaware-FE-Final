import { sendGet, sendPost, sendPut } from "./axios";
import {
	ICreateOrderResponse,
	IGetOrdersResponse,
	IGetOrderResponse,
	IUpdateOrderToPaidResponse,
	IUpdateOrderToDeliveredResponse,
	ICancelOrderResponse,
	IConfirmOrderResponse,
} from "../../interface/response/order";
import {
	ICreateOrderBody,
	IGetOrdersQuery,
	IUpdateOrderToPaidBody,
} from "../../interface/request/order";

// Create Order
export const createOrder = async (body: ICreateOrderBody): Promise<ICreateOrderResponse> => {
	return await sendPost(`/orders`, body);
};

// Get All Orders (Admin)
export const getOrders = async (query?: IGetOrdersQuery): Promise<IGetOrdersResponse> => {
	return await sendGet(`/orders`, query);
};

// Get Order By ID
export const getOrder = async (id: string): Promise<IGetOrderResponse> => {
	return await sendGet(`/orders/${id}`);
};

export const getMyOrders = async (query?: IGetOrdersQuery): Promise<IGetOrdersResponse> => {
	return await sendGet(`/orders/my/orders`, query);
};

// Update Order To Paid
export const updateOrderToPaid = async (id: string, body: IUpdateOrderToPaidBody): Promise<IUpdateOrderToPaidResponse> => {
	return await sendPut(`/orders/${id}/pay`, body);
};

// Update Order To Delivered
export const updateOrderToDelivered = async (id: string): Promise<IUpdateOrderToDeliveredResponse> => {
	return await sendPut(`/orders/${id}/deliver`);
};

// Cancel Order
export const cancelOrder = async (id: string): Promise<ICancelOrderResponse> => {
	return await sendPut(`/orders/${id}/cancel`);
};

// Confirm Order
export const confirmOrder = async (id: string): Promise<IConfirmOrderResponse> => {
	return await sendPut(`/orders/${id}/confirm`);
};

