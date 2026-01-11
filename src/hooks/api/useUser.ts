import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
	getProfile,
	updateProfile,
	getUsers,
	getUserById,
	updateUser,
	deleteUser,
	addFavorite,
	removeFavorite,
	getFavorites,
	checkPurchaseHistory,
	checkGender,
	checkStylePreference,
	getUsersForTesting,
	saveOutfit,
	getOutfits,
	deleteOutfit,
} from '../../lib/api/user';
import * as UserTypes from '../../interface/response/user';
import * as UserRequestTypes from '../../interface/request/user';

export const useGetUsers = (query?: UserRequestTypes.IGetUsersQuery) => {
	return useQuery<UserTypes.IGetUsersResponse, Error>({
		queryKey: ['users', 'list', query],
		queryFn: () => getUsers(query),
	});
};

export const useGetUserById = (id: string) => {
	return useQuery<UserTypes.IGetUserByIdResponse, Error>({
		queryKey: ['users', 'detail', id],
		queryFn: () => getUserById(id),
		enabled: !!id,
	});
};

export const useGetFavorites = (userId: string, query?: UserRequestTypes.IGetFavoritesQuery) => {
	return useQuery<UserTypes.IGetFavoritesResponse, Error>({
		queryKey: ['users', 'favorites', userId, query],
		queryFn: () => getFavorites(userId, query),
		enabled: !!userId,
	});
};

export const useCheckPurchaseHistory = (userId: string) => {
	return useQuery<UserTypes.ICheckPurchaseHistoryResponse, Error>({
		queryKey: ['users', 'purchase-history', userId],
		queryFn: () => checkPurchaseHistory(userId),
		enabled: !!userId,
	});
};

export const useCheckGender = (userId: string) => {
	return useQuery<UserTypes.ICheckGenderResponse, Error>({
		queryKey: ['users', 'gender', userId],
		queryFn: () => checkGender(userId),
		enabled: !!userId,
	});
};

export const useCheckStylePreference = (userId: string) => {
	return useQuery<UserTypes.ICheckStylePreferenceResponse, Error>({
		queryKey: ['users', 'style-preference', userId],
		queryFn: () => checkStylePreference(userId),
		enabled: !!userId,
	});
};

export const useGetUsersForTesting = (query: UserRequestTypes.IGetUsersForTestingQuery) => {
	return useQuery<UserTypes.IGetUsersForTestingResponse, Error>({
		queryKey: ['users', 'testing', query],
		queryFn: () => getUsersForTesting(query),
	});
};

// Mutations with cache invalidation
export const useUpdateProfile = () => {
	const queryClient = useQueryClient();

	return useMutation<UserTypes.IUpdateProfileResponse, Error, UserRequestTypes.IUpdateProfileBody>({
		mutationFn: updateProfile,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['users', 'profile'] });
			queryClient.invalidateQueries({ queryKey: ['users', 'detail'] });
			queryClient.invalidateQueries({ queryKey: ['users', 'list'] });
		},
	});
};

export const useUpdateUser = () => {
	const queryClient = useQueryClient();

	return useMutation<
		UserTypes.IUpdateUserResponse,
		Error,
		{ id: string; body: UserRequestTypes.IUpdateUserBody }
	>({
		mutationFn: ({ id, body }) => updateUser(id, body),
		onSuccess: (data, variables) => {
			queryClient.invalidateQueries({ queryKey: ['users', 'detail', variables.id] });
			queryClient.invalidateQueries({ queryKey: ['users', 'list'] });
		},
	});
};

export const useDeleteUser = () => {
	const queryClient = useQueryClient();

	return useMutation<UserTypes.IDeleteUserResponse, Error, string>({
		mutationFn: deleteUser,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['users'] });
		},
	});
};

export const useAddFavorite = () => {
	const queryClient = useQueryClient();

	return useMutation<
		UserTypes.IAddFavoriteResponse,
		Error,
		{ userId: string; body: UserRequestTypes.IAddFavoriteBody }
	>({
		mutationFn: ({ userId, body }) => addFavorite(userId, body),
		onSuccess: (data, variables) => {
			queryClient.invalidateQueries({ queryKey: ['users', 'favorites', variables.userId] });
		},
	});
};

export const useRemoveFavorite = () => {
	const queryClient = useQueryClient();

	return useMutation<
		UserTypes.IRemoveFavoriteResponse,
		Error,
		{ userId: string; productId: string }
	>({
		mutationFn: ({ userId, productId }) => removeFavorite(userId, productId),
		onSuccess: (data, variables) => {
			queryClient.invalidateQueries({ queryKey: ['users', 'favorites', variables.userId] });
		},
	});
};

export const useSaveOutfit = () => {
	const queryClient = useQueryClient();

	return useMutation<
		UserTypes.ISaveOutfitResponse,
		Error,
		{ userId: string; body: UserRequestTypes.ISaveOutfitBody }
	>({
		mutationFn: ({ userId, body }) => saveOutfit(userId, body),
		onSuccess: (data, variables) => {
			queryClient.invalidateQueries({ queryKey: ['users', 'outfits', variables.userId] });
			queryClient.invalidateQueries({ queryKey: ['users', 'detail', variables.userId] });
		},
	});
};

export const useGetOutfits = (userId: string) => {
	return useQuery<UserTypes.IGetOutfitsResponse, Error>({
		queryKey: ['users', 'outfits', userId],
		queryFn: () => getOutfits(userId),
		enabled: !!userId,
	});
};

export const useDeleteOutfit = () => {
	const queryClient = useQueryClient();

	return useMutation<
		UserTypes.IDeleteOutfitResponse,
		Error,
		{ userId: string; outfitId: string }
	>({
		mutationFn: ({ userId, outfitId }) => deleteOutfit(userId, outfitId),
		onSuccess: (data, variables) => {
			queryClient.invalidateQueries({ queryKey: ['users', 'outfits', variables.userId] });
			queryClient.invalidateQueries({ queryKey: ['users', 'detail', variables.userId] });
		},
	});
};

