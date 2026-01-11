export interface IContentSection {
	_id: string;
	type: string;
	image?: string;
	images?: string[];
	subtitle?: string;
	title?: string;
	button_text?: string;
	button_link?: string;
	position?: number;
	createdAt?: string;
	updatedAt?: string;
}

export interface IGetContentSectionsResponse {
	success: boolean;
	data: {
		contentSections: IContentSection[];
		page: number;
		pages: number;
		count: number;
	};
	message: string;
}

export interface ICreateContentSectionResponse extends IContentSection {}

export interface IUpdateContentSectionResponse extends IContentSection {}

export interface IDeleteContentSectionResponse {
	message: string;
}

