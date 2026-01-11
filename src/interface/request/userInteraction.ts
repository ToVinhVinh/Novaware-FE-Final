export type InteractionType = 'view' | 'like' | 'cart' | 'purchase' | 'review';

export interface ICreateUserInteractionBody {
	user_id?: string; // Optional if user is logged in (will be extracted from token)
	product_id: string | number;
	interaction_type: InteractionType;
	rating?: number; // Optional, only for review type
}

export interface IAddInteractionToHistoryBody {
	product_id: string | number;
	interaction_type: InteractionType;
	timestamp?: string; // Optional, ISO format datetime string
}

export interface IUpdateInteractionBody {
	product_id: string | number;
	interaction_type: InteractionType;
	timestamp?: string; // Optional, ISO format datetime string
}

export interface IGetUserInteractionsQuery {
	page?: number;
	page_size?: number;
}

