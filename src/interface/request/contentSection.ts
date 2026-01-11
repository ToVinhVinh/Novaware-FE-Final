export interface IGetContentSectionsQuery {
	type?: string;
	pageNumber?: number;
	perPage?: number;
}

export interface ICreateContentSectionBody {
	type: string;
	image?: string;
	images?: string[];
	subtitle?: string;
	title?: string;
	button_text?: string;
	button_link?: string;
	position?: number;
}

export interface IUpdateContentSectionBody {
	type?: string;
	image?: string;
	images?: string[];
	subtitle?: string;
	title?: string;
	button_text?: string;
	button_link?: string;
	position?: number;
}

