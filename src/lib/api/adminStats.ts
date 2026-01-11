import { sendGet } from "./axios";

// Response Interfaces
export interface IOverviewStatsResponse {
	status: string;
	message: string;
	data: {
		totals: {
			users: number;
			products: number;
			orders: number;
			revenue: number;
		};
		this_month: {
			revenue: number;
			orders: number;
			new_users: number;
		};
		growth: {
			revenue_percent: number;
			orders_percent: number;
			users_percent: number;
		};
	};
}

export interface IRevenueChartResponse {
	status: string;
	message: string;
	data: {
		period: string;
		group_by: string;
		labels: string[];
		datasets: Array<{
			name: string;
			data: number[];
		}>;
	};
}

export interface ITopProductsResponse {
	status: string;
	message: string;
	data: {
		sort_by: string;
		limit: number;
		products: Array<{
			product_id: string;
			name: string;
			quantity: number;
			revenue: number;
		}>;
	};
}

export interface IUserDemographicsResponse {
	status: string;
	message: string;
	data: {
		gender: {
			labels: string[];
			data: number[];
		};
		age_groups: {
			labels: string[];
			data: number[];
		};
	};
}

export interface IOrderStatusResponse {
	status: string;
	message: string;
	data: {
		payment_status: {
			labels: string[];
			data: number[];
		};
		fulfillment_status: {
			labels: string[];
			data: number[];
		};
	};
}

export interface IRecentOrdersResponse {
	status: string;
	message: string;
	data: {
		limit: number;
		orders: Array<{
			id: string;
			user_id: string;
			total_price: number;
			is_paid: boolean;
			is_delivered: boolean;
			created_at: string;
			items: any[];
		}>;
	};
}

export interface IProductCategoriesResponse {
	status: string;
	message: string;
	data: {
		labels: string[];
		data: number[];
	};
}

export interface ISalesByGenderResponse {
	status: string;
	message: string;
	data: {
		labels: string[];
		data: number[];
	};
}

// Query Interfaces
export interface IRevenueChartQuery {
	period?: "7d" | "30d" | "90d" | "1y";
}

export interface ITopProductsQuery {
	limit?: number;
	sort_by?: "revenue" | "quantity";
}

export interface IRecentOrdersQuery {
	limit?: number;
}

// API Functions
export const getOverviewStats = async (): Promise<IOverviewStatsResponse> => {
	return await sendGet(`/admin-stats/overview`);
};

export const getRevenueChart = async (query?: IRevenueChartQuery): Promise<IRevenueChartResponse> => {
	return await sendGet(`/admin-stats/revenue-chart`, query);
};

export const getTopProducts = async (query?: ITopProductsQuery): Promise<ITopProductsResponse> => {
	return await sendGet(`/admin-stats/top-products`, query);
};

export const getUserDemographics = async (): Promise<IUserDemographicsResponse> => {
	return await sendGet(`/admin-stats/user-demographics`);
};

export const getOrderStatus = async (): Promise<IOrderStatusResponse> => {
	return await sendGet(`/admin-stats/order-status`);
};

export const getRecentOrders = async (query?: IRecentOrdersQuery): Promise<IRecentOrdersResponse> => {
	return await sendGet(`/admin-stats/recent-orders`, query);
};

export const getProductCategories = async (): Promise<IProductCategoriesResponse> => {
	return await sendGet(`/admin-stats/product-categories`);
};

export const getSalesByGender = async (): Promise<ISalesByGenderResponse> => {
	return await sendGet(`/admin-stats/sales-by-gender`);
};
