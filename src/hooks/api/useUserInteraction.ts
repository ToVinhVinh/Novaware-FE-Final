import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
	createUserInteraction,
	addInteractionToHistory,
	updateInteraction,
	getUserInteractions,
} from '../../lib/api/userInteraction';
import * as UserInteractionTypes from '../../interface/response/userInteraction';
import * as UserInteractionRequestTypes from '../../interface/request/userInteraction';

export const useGetUserInteractions = (query?: UserInteractionRequestTypes.IGetUserInteractionsQuery) => {
	return useQuery<UserInteractionTypes.IGetUserInteractionsResponse, Error>({
		queryKey: ['user-interactions', 'list', query],
		queryFn: () => getUserInteractions(query),
	});
};

export const useCreateUserInteraction = () => {
	const queryClient = useQueryClient();

	return useMutation<
		UserInteractionTypes.ICreateUserInteractionResponse,
		Error,
		UserInteractionRequestTypes.ICreateUserInteractionBody
	>({
		mutationFn: createUserInteraction,
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ['user-interactions'] });
			if (data.data?.interaction) {
				queryClient.invalidateQueries({ queryKey: ['users'] });
			}
		},
	});
};

export const useAddInteractionToHistory = (userId: string) => {
	const queryClient = useQueryClient();

	return useMutation<
		UserInteractionTypes.IAddInteractionToHistoryResponse,
		Error,
		UserInteractionRequestTypes.IAddInteractionToHistoryBody
	>({
		mutationFn: (body) => addInteractionToHistory(userId, body),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['users', 'detail', userId] });
			queryClient.invalidateQueries({ queryKey: ['users', 'profile'] });
		},
	});
};

export const useUpdateInteraction = (userId: string) => {
	const queryClient = useQueryClient();

	return useMutation<
		UserInteractionTypes.IUpdateInteractionResponse,
		Error,
		UserInteractionRequestTypes.IUpdateInteractionBody
	>({
		mutationFn: (body) => updateInteraction(userId, body),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['users', 'detail', userId] });
			queryClient.invalidateQueries({ queryKey: ['users', 'profile'] });
			queryClient.invalidateQueries({ queryKey: ['user-interactions'] });
		},
	});
};

export const useUpdateInteractionAuto = () => {
	return {
		useUpdateInteraction,
		useAddInteractionToHistory,
	};
};

