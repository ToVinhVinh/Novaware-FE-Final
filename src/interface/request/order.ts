export interface IOrderItem {
	product: string;
	name: string;
	image?: string;
	images?: string[];
	price: number;
	priceSale?: number;
	qty: number;
	sizeSelected: string;
	colorSelected?: string;
}

export interface IShippingAddress {
	address: string;
	city: string;
	postalCode: string;
	country: string;
}

export interface ICreateOrderBody {
	orderItems: IOrderItem[];
	shippingAddress: IShippingAddress;
	paymentMethod: string;
	itemsPrice: number;
	taxPrice: number;
	shippingPrice: number;
	totalPrice: number;
	user_id?: string;
}

export interface IGetOrdersQuery {
	pageNumber?: number;
	perPage?: number;
	keyword?: string;
	user_id?: string;
}

export interface IUpdateOrderToPaidBody {
	id: string;
	status: string;
	update_time: string;
	payer: {
		email_address: string;
	};
}

