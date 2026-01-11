export interface IOrderItem {
	product?: string;
	product_id?: string | number;
	name: string;
	image?: string;
	images?: string[];
	price?: number;
	priceSale?: number;
	price_sale?: number;
	qty: number;
	sizeSelected?: string;
	size_selected?: string;
	colorSelected?: string;
	color_selected?: string;
}

export interface IShippingAddress {
	address: string;
	city: string;
	postalCode?: string;
	postal_code?: string;
	country: string;
	recipientPhoneNumber?: string;
	recipient_phone_number?: string;
}

export interface IOrder {
	_id?: string;
	id?: string;
	user_id?: string;
	user?: {
		_id: string;
		name: string;
		email: string;
	};
	orderItems?: IOrderItem[];
	items?: IOrderItem[];
	shippingAddress?: IShippingAddress;
	shipping_address?: IShippingAddress;
	paymentMethod?: string;
	payment_method?: string;
	paymentResult?: {
		id: string;
		status: string;
		update_time: string;
		email_address: string;
	};
	payment_result?: {
		id: string;
		status: string;
		update_time: string;
		email_address: string;
	};
	itemsPrice?: number;
	taxPrice?: number;
	tax_price?: number;
	shippingPrice?: number;
	shipping_price?: number;
	totalPrice?: number;
	total_price?: number;
	isPaid?: boolean;
	is_paid?: boolean;
	paidAt?: string;
	paid_at?: string | null;
	isDelivered?: boolean;
	is_delivered?: boolean;
	deliveredAt?: string;
	delivered_at?: string | null;
	isCancelled?: boolean;
	is_cancelled?: boolean;
	cancelledAt?: string;
	cancelled_at?: string | null;
	isConfirmed?: boolean;
	is_processing?: boolean;
	is_outfit_purchase?: boolean;
	confirmedAt?: string;
	createdAt?: string;
	created_at?: string;
	updatedAt?: string;
	updated_at?: string;
}

export interface ICreateOrderResponse {
	status?: string;
	message: string;
	data: {
		order: IOrder;
	};
}

export interface IGetOrdersResponse {
	message: string;
	data: {
		orders: IOrder[];
		page: number;
		pages: number;
		count: number;
	};
}

export interface IGetOrderResponse {
	message: string;
	data: {
		order: IOrder;
	};
}

export interface IUpdateOrderToPaidResponse {
	message: string;
	data: {
		order: IOrder;
	};
}

export interface IUpdateOrderToDeliveredResponse {
	message: string;
	data: {
		order: IOrder;
	};
}

export interface ICancelOrderResponse {
	message: string;
	data: {
		order: IOrder;
	};
}

export interface IConfirmOrderResponse {
	message: string;
	data: {
		order: IOrder;
	};
}

