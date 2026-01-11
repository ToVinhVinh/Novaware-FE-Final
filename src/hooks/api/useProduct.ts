import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
	getProducts,
	getProduct,
	createProduct,
	updateProduct,
	deleteProduct,
	createReview,
	getTopProducts,
	getLatestProducts,
	getSaleProducts,
	getRelatedProducts,
	getProductsByPrice,
	filterProducts,
	searchProductsByName,
} from '../../lib/api/product';
import * as ProductTypes from '../../interface/response/product';
import * as ProductRequestTypes from '../../interface/request/product';

export const useGetProducts = (query?: ProductRequestTypes.IGetProductsQuery) => {
	return useQuery<ProductTypes.IGetProductsResponse, Error>({
		queryKey: ['products', 'list', query],
		queryFn: () => getProducts(query),
	});
};

export const useGetProduct = (id: string) => {
	return useQuery<ProductTypes.IGetProductResponse, Error>({
		queryKey: ['products', 'detail', id],
		queryFn: () => getProduct(id),
		enabled: !!id,
	});
};

export const useGetTopProducts = (query?: ProductRequestTypes.IGetTopProductsQuery) => {
	return useQuery<ProductTypes.IGetTopProductsResponse, Error>({
		queryKey: ['products', 'top', query],
		queryFn: () => getTopProducts(query),
	});
};

export const useGetLatestProducts = (query?: ProductRequestTypes.IGetLatestProductsQuery) => {
	return useQuery<ProductTypes.IGetLatestProductsResponse, Error>({
		queryKey: ['products', 'latest', query],
		queryFn: () => getLatestProducts(query),
	});
};

export const useGetSaleProducts = (query?: ProductRequestTypes.IGetSaleProductsQuery) => {
	return useQuery<ProductTypes.IGetSaleProductsResponse, Error>({
		queryKey: ['products', 'sale', query],
		queryFn: () => getSaleProducts(query),
	});
};

export const useGetRelatedProducts = (query?: ProductRequestTypes.IGetRelatedProductsQuery) => {
	return useQuery<ProductTypes.IGetRelatedProductsResponse, Error>({
		queryKey: ['products', 'related', query],
		queryFn: () => getRelatedProducts(query),
	});
};

export const useGetProductsByPrice = (query?: ProductRequestTypes.IGetProductsByPriceQuery) => {
	return useQuery<ProductTypes.IGetProductsByPriceResponse, Error>({
		queryKey: ['products', 'price', query],
		queryFn: () => getProductsByPrice(query),
	});
};

export const useFilterProducts = (query?: ProductRequestTypes.IFilterProductsQuery) => {
	return useQuery<ProductTypes.IFilterProductsResponse, Error>({
		queryKey: ['products', 'filter', query],
		queryFn: () => filterProducts(query),
	});
};

export const useSearchProductsByName = (query?: ProductRequestTypes.ISearchProductsByNameQuery) => {
	return useQuery<ProductTypes.ISearchProductsByNameResponse, Error>({
		queryKey: ['products', 'search_by_name', query],
		queryFn: () => searchProductsByName(query),
		enabled: !!(query?.q || query?.query || query?.search), // Only run query if search term is provided
	});
};

// Mutations
export const useCreateProduct = () => {
	const queryClient = useQueryClient();

	return useMutation<ProductTypes.ICreateProductResponse, Error, ProductRequestTypes.ICreateProductBody>({
		mutationFn: createProduct,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['products'] });
		},
	});
};

export const useUpdateProduct = () => {
	const queryClient = useQueryClient();

	return useMutation<
		ProductTypes.IUpdateProductResponse,
		Error,
		{ id: string; body: ProductRequestTypes.IUpdateProductBody }
	>({
		mutationFn: ({ id, body }) => updateProduct(id, body),
		onSuccess: (data, variables) => {
			queryClient.invalidateQueries({ queryKey: ['products', 'detail', variables.id] });
			queryClient.invalidateQueries({ queryKey: ['products'] });
		},
	});
};

export const useDeleteProduct = () => {
	const queryClient = useQueryClient();

	return useMutation<ProductTypes.IDeleteProductResponse, Error, string>({
		mutationFn: deleteProduct,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['products'] });
		},
	});
};

export const useCreateReview = () => {
	const queryClient = useQueryClient();

	return useMutation<
		ProductTypes.ICreateReviewResponse,
		Error,
		{ id: string; body: ProductRequestTypes.ICreateReviewBody }
	>({
		mutationFn: ({ id, body }) => createReview(id, body),
		onSuccess: (data, variables) => {
			queryClient.invalidateQueries({ queryKey: ['products', 'detail', variables.id] });
		},
	});
};

