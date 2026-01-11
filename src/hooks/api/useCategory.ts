import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
	getCategories,
	getCategoryCounts,
	createCategory,
	updateCategory,
	deleteCategory,
} from '../../lib/api/category';
import * as CategoryTypes from '../../interface/response/category';
import * as CategoryRequestTypes from '../../interface/request/category';

export const useGetCategories = (query?: CategoryRequestTypes.IGetCategoriesQuery) => {
	return useQuery<CategoryTypes.IGetCategoriesResponse, Error>({
		queryKey: ['categories', 'list', query],
		queryFn: () => getCategories(query),
	});
};

export const useGetCategoryCounts = (query?: CategoryRequestTypes.IGetCategoriesQuery) => {
	return useQuery<CategoryTypes.IGetCategoryCountsResponse, Error>({
		queryKey: ['categories', 'counts', query],
		queryFn: () => getCategoryCounts(query),
	});
};

export const useCreateCategory = () => {
	const queryClient = useQueryClient();

	return useMutation<CategoryTypes.ICreateCategoryResponse, Error, CategoryRequestTypes.ICreateCategoryBody>({
		mutationFn: createCategory,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['categories'] });
		},
	});
};

export const useUpdateCategory = () => {
	const queryClient = useQueryClient();

	return useMutation<
		CategoryTypes.IUpdateCategoryResponse,
		Error,
		{ id: string; body: CategoryRequestTypes.IUpdateCategoryBody }
	>({
		mutationFn: ({ id, body }) => updateCategory(id, body),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['categories'] });
		},
	});
};

export const useDeleteCategory = () => {
	const queryClient = useQueryClient();

	return useMutation<CategoryTypes.IDeleteCategoryResponse, Error, string>({
		mutationFn: deleteCategory,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['categories'] });
		},
	});
};

