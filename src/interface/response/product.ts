export interface IProductSize {
	[key: string]: number | undefined;
	s?: number;
	m?: number;
	l?: number;
	xl?: number;
}

export interface IProductColor {
	name: string;
	hexCode: string;
}

export interface IProductVariant {
	id?: string;
	sku?: string;
	size: string;
	color: string;
	stock: number;
	price?: number;
	image?: string | null;
}

export interface IProductReview {
	_id?: string;
	user?: string;
	name?: string;
	rating: number;
	comment: string;
	createdAt?: string;
}

export interface IProduct {
	_id: string;
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
	slug?: string;
	price: number;
	sale?: number;
	images: string[];
	brand: string;
	brandId?: string | null;
	category: string;
	categoryId?: string | null;
	description: string;
	size: IProductSize;
	countInStock: number;
	colors?: IProductColor[];
	rating?: number;
	numReviews?: number;
	reviews?: IProductReview[];
	createdAt?: string;
	updatedAt?: string;
	variants?: IProductVariant[];
}

export interface IGetProductsResponse {
	message: string;
	data: {
		products: IProduct[];
		page: number;
		pages: number;
		count: number;
	};
}

export interface IGetProductResponse {
	message: string;
	data: {
		product: IProduct;
	};
}

export interface ICreateProductResponse {
	message: string;
	data: {
		product: IProduct;
	};
}

export interface IUpdateProductResponse {
	message: string;
	data: {
		product: IProduct;
	};
}

export interface IDeleteProductResponse {
	message: string;
}

export interface ICreateReviewResponse {
	message: string;
}

export interface IGetTopProductsResponse {
	message: string;
	data: {
		products: IProduct[];
		page: number;
		pages: number;
		count: number;
	};
}

export interface IGetLatestProductsResponse {
	message: string;
	data: {
		products: IProduct[];
		page: number;
		pages: number;
		count: number;
	};
}

export interface IGetSaleProductsResponse {
	message: string;
	data: {
		products: IProduct[];
		page: number;
		pages: number;
		count: number;
	};
}

export interface IGetRelatedProductsResponse {
	message: string;
	data: {
		products: IProduct[];
	};
}

export interface IGetProductsByPriceResponse {
	message: string;
	data: {
		products: IProduct[];
		page: number;
		pages: number;
		count: number;
	};
}

export interface IFilterProductsResponse {
	message: string;
	data: {
		products: IProduct[];
		page: number;
		pages: number;
		count: number;
	};
}

export interface ISearchProductsByNameResponse {
	success: boolean;
	message: string;
	data: {
		products: IProduct[];
		pagination: {
			page: number;
			page_size: number;
			total_count: number;
			total_pages: number;
			has_next: boolean;
			has_previous: boolean;
		};
		search_term: string;
		search_field: string;
	};
}

