export interface IChatMessage {
	sender: string;
	content: string;
	timestamp: string;
}

export interface IChat {
	_id: string;
	user?: {
		_id: string;
		name: string;
		email: string;
	};
	messages: IChatMessage[];
	createdAt?: string;
	updatedAt?: string;
}

export interface IGetChatResponse {
	message: string;
	data: {
		chat: IChat;
	};
}

export interface ISendMessageResponse {
	message: string;
	data: {
		message: IChatMessage;
	};
}

export interface IGetAllChatsResponse {
	message: string;
	data: {
		chats: IChat[];
		page: number;
		pages: number;
		count: number;
	};
}

