import { sendPost } from "./axios";
import {
	IChatGeminiResponse,
	IChatNovawareResponse,
} from "../../interface/response/chatbot";
import {
	IChatGeminiBody,
	IChatNovawareBody,
} from "../../interface/request/chatbot";

export const chatWithGemini = async (body: IChatGeminiBody): Promise<IChatGeminiResponse> => {
	return await sendPost(`/chatgemini`, body);
};

export const chatWithNovaware = async (body: IChatNovawareBody): Promise<IChatNovawareResponse> => {
	return await sendPost(`/chatnovaware`, body);
};

