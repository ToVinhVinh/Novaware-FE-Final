import { sendGet, sendPost } from "./axios";
import {
	ISendMessageResponse,
	IGetAllChatsResponse,
} from "../../interface/response/chat";
import {
	ISendMessageBody,
	IGetAllChatsQuery,
} from "../../interface/request/chat";

export const sendMessage = async (userId: string, body: ISendMessageBody): Promise<ISendMessageResponse> => {
	return await sendPost(`/chats/${userId}`, body);
};

export const getAllChats = async (query?: IGetAllChatsQuery): Promise<IGetAllChatsResponse> => {
	return await sendGet(`/chats`, query);
};

