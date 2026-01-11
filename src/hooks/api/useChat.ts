import { useQuery, useMutation } from '@tanstack/react-query';
import {
	sendMessage,
	getAllChats,
} from '../../lib/api/chat';
import * as ChatTypes from '../../interface/response/chat';
import * as ChatRequestTypes from '../../interface/request/chat';

export const useGetAllChats = (query?: ChatRequestTypes.IGetAllChatsQuery) => {
	return useQuery<ChatTypes.IGetAllChatsResponse, Error>({
		queryKey: ['chats', 'list', query],
		queryFn: () => getAllChats(query),
	});
};

export const useSendMessage = () => {
	return useMutation<
		ChatTypes.ISendMessageResponse,
		Error,
		{ userId: string; body: ChatRequestTypes.ISendMessageBody }
	>({
		mutationFn: ({ userId, body }) => sendMessage(userId, body),
	});
};

