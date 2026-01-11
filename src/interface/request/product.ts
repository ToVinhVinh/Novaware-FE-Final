export interface IGetProductsQuery {
	keyword?: string;
	search?: string;
	category?: string;
	brand?: string;
	ordering?: string;
	pageNumber?: number;
	pageSize?: number;
	option?: "all";
}

export interface ICreateProductBody {
	name: string;
	productDisplayName?: string;
	gender?: string;
	masterCategory?: string;
	subCategory?: string;
	articleType?: string;
	baseColour?: string;
	season?: string;
	year?: number;
	usage?: string;
	price: number;
	sale?: number;
	images: string[];
	brand: string;
	category: string;
	description: string;
	size: {
		s?: number;
		m?: number;
		l?: number;
		xl?: number;
	};
	colors?: string[];
	rating?: number;
}

export interface IUpdateProductBody {
	name?: string;
	productDisplayName?: string;
	gender?: string;
	masterCategory?: string;
	subCategory?: string;
	articleType?: string;
	baseColour?: string;
	season?: string;
	year?: number;
	usage?: string;
	price?: number;
	sale?: number;
	images?: string[];
	brand?: string;
	category?: string;
	description?: string;
	size?: {
		s?: number;
		m?: number;
		l?: number;
		xl?: number;
	};
	colors?: string[];
	rating?: number;
}

export interface ICreateReviewBody {
	rating: number;
	comment: string;
}

export interface IGetTopProductsQuery {
	pageNumber?: number;
	perPage?: number;
}

export interface IGetLatestProductsQuery {
	pageNumber?: number;
	perPage?: number;
}

export interface IGetSaleProductsQuery {
	pageNumber?: number;
	perPage?: number;
}

export interface IGetRelatedProductsQuery {
	category?: string;
	excludeId?: string;
}

export interface IGetProductsByPriceQuery {
	sortBy?: "asc" | "desc";
	pageNumber?: number;
	perPage?: number;
}

export interface IFilterProductsQuery {
	keyword?: string;
	categories?: string; // comma-separated
	brands?: string; // comma-separated
	gender?: string;
	usage?: string;
	priceMin?: number;
	priceMax?: number;
	sort_by?: "latest" | "rating" | "sale" | "priceAsc" | "priceDesc";
	articleType?: string;
	pageNumber?: number;
	perPage?: number;
}

export interface ISearchProductsByNameQuery {
	q?: string;
	query?: string;
	search?: string;
	category?: string;
	articleType?: string;
	gender?: string;
	masterCategory?: string;
	subCategory?: string;
	min_price?: number;
	max_price?: number;
	sort_by?: "default" | "price_low_to_high" | "price_high_to_low" | "rating" | "name_asc" | "name_desc";
	page?: number;
	page_size?: number;
}

