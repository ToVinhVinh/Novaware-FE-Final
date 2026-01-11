import { sendGet, sendPost, sendPut, sendPatch } from './axios';
import {
	ICreateUserInteractionResponse,
	IAddInteractionToHistoryResponse,
	IUpdateInteractionResponse,
	IGetUserInteractionsResponse,
} from '../../interface/response/userInteraction';
import {
	ICreateUserInteractionBody,
	IAddInteractionToHistoryBody,
	IUpdateInteractionBody,
	IGetUserInteractionsQuery,
} from '../../interface/request/userInteraction';

export const createUserInteraction = async (
	body: ICreateUserInteractionBody
): Promise<ICreateUserInteractionResponse> => {
	return await sendPost('/user-interactions', body);
};

export const addInteractionToHistory = async (
	userId: string,
	body: IAddInteractionToHistoryBody
): Promise<IAddInteractionToHistoryResponse> => {
	return await sendPost(`/users/${userId}/add_interaction`, body);
};

export const updateInteraction = async (
	userId: string,
	body: IUpdateInteractionBody
): Promise<IUpdateInteractionResponse> => {
	return await sendPut(`/users/${userId}/update_interaction`, body);
};

export const getUserInteractions = async (
	query?: IGetUserInteractionsQuery
): Promise<IGetUserInteractionsResponse> => {
	return await sendGet('/user-interactions', query);
};

