export interface ISendMessageBody {
	sender: string;
	content: string;
}

export interface IGetAllChatsQuery {
	pageNumber?: number;
	perPage?: number;
}

