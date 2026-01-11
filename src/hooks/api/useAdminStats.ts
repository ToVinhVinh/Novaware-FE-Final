import { useQuery } from '@tanstack/react-query';
import {
	getOverviewStats,
	getRevenueChart,
	getTopProducts,
	getUserDemographics,
	getOrderStatus,
	getRecentOrders,
	getProductCategories,
	getSalesByGender,
	IOverviewStatsResponse,
	IRevenueChartResponse,
	ITopProductsResponse,
	IUserDemographicsResponse,
	IOrderStatusResponse,
	IRecentOrdersResponse,
	IProductCategoriesResponse,
	ISalesByGenderResponse,
	IRevenueChartQuery,
	ITopProductsQuery,
	IRecentOrdersQuery,
} from '../../lib/api/adminStats';

export const useGetOverviewStats = () => {
	return useQuery<IOverviewStatsResponse, Error>({
		queryKey: ['admin-stats', 'overview'],
		queryFn: getOverviewStats,
		staleTime: 5 * 60 * 1000, // Cache for 5 minutes
		cacheTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
	});
};


export const useGetRevenueChart = (query?: IRevenueChartQuery) => {
	return useQuery<IRevenueChartResponse, Error>({
		queryKey: ['admin-stats', 'revenue-chart', query],
		queryFn: () => getRevenueChart(query),
		staleTime: 5 * 60 * 1000,
		cacheTime: 10 * 60 * 1000,
	});
};

export const useGetTopProducts = (query?: ITopProductsQuery) => {
	return useQuery<ITopProductsResponse, Error>({
		queryKey: ['admin-stats', 'top-products', query],
		queryFn: () => getTopProducts(query),
		staleTime: 5 * 60 * 1000,
		cacheTime: 10 * 60 * 1000,
	});
};

export const useGetUserDemographics = () => {
	return useQuery<IUserDemographicsResponse, Error>({
		queryKey: ['admin-stats', 'user-demographics'],
		queryFn: getUserDemographics,
		staleTime: 10 * 60 * 1000, // Cache for 10 minutes (less frequently changing)
		cacheTime: 15 * 60 * 1000,
	});
};

export const useGetOrderStatus = () => {
	return useQuery<IOrderStatusResponse, Error>({
		queryKey: ['admin-stats', 'order-status'],
		queryFn: getOrderStatus,
		staleTime: 5 * 60 * 1000,
		cacheTime: 10 * 60 * 1000,
	});
};


export const useGetRecentOrders = (query?: IRecentOrdersQuery) => {
	return useQuery<IRecentOrdersResponse, Error>({
		queryKey: ['admin-stats', 'recent-orders', query],
		queryFn: () => getRecentOrders(query),
		staleTime: 2 * 60 * 1000, // Cache for 2 minutes (more frequently changing)
		cacheTime: 5 * 60 * 1000,
		refetchInterval: 30 * 1000, // Auto-refresh every 30 seconds
	});
};

export const useGetProductCategories = () => {
	return useQuery<IProductCategoriesResponse, Error>({
		queryKey: ['admin-stats', 'product-categories'],
		queryFn: getProductCategories,
		staleTime: 10 * 60 * 1000,
		cacheTime: 15 * 60 * 1000,
	});
};


export const useGetSalesByGender = () => {
	return useQuery<ISalesByGenderResponse, Error>({
		queryKey: ['admin-stats', 'sales-by-gender'],
		queryFn: getSalesByGender,
		staleTime: 5 * 60 * 1000,
		cacheTime: 10 * 60 * 1000,
	});
};
