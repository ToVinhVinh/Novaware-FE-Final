import { useMutation } from '@tanstack/react-query';
import {
	chatWithGemini,
	chatWithNovaware,
} from '../../lib/api/chatbot';
import * as ChatbotTypes from '../../interface/response/chatbot';
import * as ChatbotRequestTypes from '../../interface/request/chatbot';

export const useChatWithGemini = () => {
	return useMutation<ChatbotTypes.IChatGeminiResponse, Error, ChatbotRequestTypes.IChatGeminiBody>({
		mutationFn: chatWithGemini,
	});
};

export const useChatWithNovaware = () => {
	return useMutation<ChatbotTypes.IChatNovawareResponse, Error, ChatbotRequestTypes.IChatNovawareBody>({
		mutationFn: chatWithNovaware,
	});
};

