import { InteractionType } from '../request/userInteraction';

export interface IUserInteraction {
	id: string;
	product_id: string;
	interaction_type: InteractionType;
	rating: number | null;
	timestamp: string;
}

export interface IInteractionHistoryItem {
	product_id: number | string;
	interaction_type: InteractionType;
	timestamp: string;
}

export interface ICreateUserInteractionResponse {
	success: boolean;
	message: string;
	data: {
		interaction: IUserInteraction;
	} | null;
}

export interface IAddInteractionToHistoryResponse {
	success: boolean;
	message: string;
	data: {
		user_id: string;
		interaction: IInteractionHistoryItem;
		total_interactions: number;
	} | null;
}

export interface IUpdateInteractionResponse {
	success: boolean;
	message: string;
	data: {
		user_id: string;
		product_id: number | string;
		interaction_type: InteractionType;
		updated: boolean; // true if updated, false if created new
		total_interactions: number;
	} | null;
}

export interface IGetUserInteractionsResponse {
	success: boolean;
	message: string;
	data: {
		interactions: IUserInteraction[];
		page: number;
		pages: number;
		perPage: number;
		count: number;
	} | null;
}

