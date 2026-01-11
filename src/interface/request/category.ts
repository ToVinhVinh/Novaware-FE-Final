export interface IGetCategoriesQuery {
	pageNumber?: number;
	perPage?: number;
}

export interface ICreateCategoryBody {
	name: string;
}

export interface IUpdateCategoryBody {
	name: string;
}

