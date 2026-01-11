import { sendGet, sendPost, sendPut, sendDelete } from "./axios";
import {
	IGetProductsResponse,
	IGetProductResponse,
	ICreateProductResponse,
	IUpdateProductResponse,
	IDeleteProductResponse,
	ICreateReviewResponse,
	IGetTopProductsResponse,
	IGetLatestProductsResponse,
	IGetSaleProductsResponse,
	IGetRelatedProductsResponse,
	IGetProductsByPriceResponse,
	IFilterProductsResponse,
	ISearchProductsByNameResponse,
} from "../../interface/response/product";
import { IProduct, IProductColor, IProductVariant, IProductSize } from "../../interface/response/product";
import {
	IGetProductsQuery,
	ICreateProductBody,
	IUpdateProductBody,
	ICreateReviewBody,
	IGetTopProductsQuery,
	IGetLatestProductsQuery,
	IGetSaleProductsQuery,
	IGetRelatedProductsQuery,
	IGetProductsByPriceQuery,
	IFilterProductsQuery,
	ISearchProductsByNameQuery,
} from "../../interface/request/product";

export const getProducts = async (query?: IGetProductsQuery): Promise<IGetProductsResponse> => {
	return await sendGet(`/products`, query);
};

// Get Product By ID
const toNumber = (value: unknown, fallback = 0): number => {
	const parsed = Number(value);
	return Number.isFinite(parsed) ? parsed : fallback;
};

const normalizeSize = (rawSize: any): IProductSize => {
	if (!rawSize || typeof rawSize !== "object") return {};
	return Object.keys(rawSize).reduce((acc: IProductSize, key: string) => {
		const normalizedKey = key.toLowerCase();
		acc[normalizedKey] = toNumber(rawSize[key]);
		return acc;
	}, {} as IProductSize);
};

const normalizeColors = (rawColors: any, rawColorIds: any): IProductColor[] => {
	const colors: IProductColor[] = [];

	if (Array.isArray(rawColors)) {
		rawColors.forEach((color) => {
			if (typeof color === "string") {
				colors.push({ name: color, hexCode: color });
				return;
			}

			if (color && (color.name || color.hexCode || color.hex || color.code)) {
				colors.push({
					name: color.name || color.label || color.code || color.hexCode || color.hex || "",
					hexCode: color.hexCode || color.hex || color.code || "",
				});
			}
		});
	}

	if (colors.length === 0 && Array.isArray(rawColorIds)) {
		rawColorIds.forEach((color) => {
			if (typeof color === "string") {
				colors.push({ name: color, hexCode: color });
				return;
			}

			if (color && (color.name || color.hexCode)) {
				colors.push({
					name: color.name || color.hexCode || "",
					hexCode: color.hexCode || color.name || "",
				});
			}
		});
	}

	return colors;
};

const normalizeVariants = (
	rawVariants: any,
	sizeData: IProductSize,
	unitPrice: number,
	productId: string,
): IProductVariant[] => {
	if (Array.isArray(rawVariants) && rawVariants.length > 0) {
		return rawVariants.reduce((acc: IProductVariant[], variant: any, index: number) => {
			if (!variant) return acc;

			const size = (variant.size || variant.sizeLabel || "").toString().toUpperCase();
			const color = (variant.color || variant.colorHex || variant.hexCode || "").toString();
			const stock = toNumber(variant.stock ?? variant.quantity ?? variant.count ?? variant.inventory ?? 0);
			const price = variant.price !== undefined ? toNumber(variant.price) : unitPrice;

			acc.push({
				id: variant.id || variant._id || `${productId || "variant"}-${index}`,
				sku: variant.sku || variant.code,
				size,
				color,
				stock,
				price,
				image: variant.image || variant.thumbnail || null,
			});

			return acc;
		}, []);
	}

	// Fallback: build variants from size data when no explicit variants provided
	return Object.entries(sizeData).reduce((acc: IProductVariant[], [sizeKey, stockValue]) => {
		const stock = toNumber(stockValue);
		if (stock <= 0) return acc;

		acc.push({
			id: `${productId || "variant"}-${sizeKey}`,
			size: sizeKey.toUpperCase(),
			color: "",
			stock,
			price: unitPrice,
			image: null,
		});

		return acc;
	}, []);
};

const normalizeProduct = (raw: any): IProduct => {
	if (!raw || typeof raw !== "object") {
		return {
			_id: "",
			name: "",
			price: 0,
			sale: 0,
			images: [],
			brand: "",
			category: "",
			description: "",
			size: {},
			countInStock: 0,
			colors: [],
			rating: 0,
			numReviews: 0,
			reviews: [],
			variants: [],
		};
	}

	const productId = raw.id || raw._id || "";
	const sizeData = normalizeSize(raw.size);
	const unitPrice = toNumber(raw.price);
	const variants = normalizeVariants(raw.variants, sizeData, unitPrice, productId);
	const variantStockTotal = variants.reduce((acc, variant) => acc + toNumber(variant.stock), 0);
	const sizeStockTotal =
		variantStockTotal === 0
			? Object.values(sizeData).reduce((acc, value) => acc + toNumber(value), 0)
			: 0;
	const declaredStock = toNumber(raw.count_in_stock ?? raw.countInStock ?? raw.stock);
	const computedStock = variantStockTotal || sizeStockTotal;
	const countInStock = declaredStock > 0 ? declaredStock : computedStock;

	const colors = normalizeColors(raw.colors, raw.color_ids);

	return {
		_id: productId,
		name: raw.name || "",
		productDisplayName: raw.productDisplayName || raw.product_display_name || raw.name || "",
		gender: raw.gender || "",
		masterCategory: raw.masterCategory || raw.master_category || "",
		subCategory: raw.subCategory || raw.sub_category || "",
		articleType: raw.articleType || raw.article_type || "",
		baseColour: raw.baseColour || raw.base_colour || "",
		season: raw.season || "",
		year: toNumber(raw.year ?? raw.release_year ?? raw.releaseYear ?? 0) || undefined,
		usage: raw.usage || "",
		slug: raw.slug || "",
		price: unitPrice,
		sale: toNumber(raw.sale ?? raw.discount ?? 0),
		images: Array.isArray(raw.images) ? raw.images.filter(Boolean) : [],
		brand: raw.brand_name || raw.brand || "",
		brandId: raw.brand_id ?? raw.brandId ?? null,
		category: raw.category_detail?.name || raw.category || raw.category_id || "",
		categoryId: raw.category_id ?? raw.categoryId ?? null,
		description: raw.description || "",
		size: sizeData,
		countInStock,
		colors,
		rating: toNumber(raw.rating ?? raw.rating_average ?? 0),
		numReviews: toNumber(raw.num_reviews ?? raw.numReviews ?? 0),
		reviews: Array.isArray(raw.reviews) ? raw.reviews : [],
		createdAt: raw.created_at || raw.createdAt,
		updatedAt: raw.updated_at || raw.updatedAt,
		variants,
	};
};

export const getProduct = async (id: string): Promise<IGetProductResponse> => {
	const response = await sendGet(`/products/${id}`);

	if (response?.data?.product) {
		return {
			...response,
			data: {
				...response.data,
				product: normalizeProduct(response.data.product),
			},
		};
	}

	return response;
};

// Create Product
export const createProduct = async (body: ICreateProductBody): Promise<ICreateProductResponse> => {
	return await sendPost(`/products`, body);
};

// Update Product
export const updateProduct = async (id: string, body: IUpdateProductBody): Promise<IUpdateProductResponse> => {
	return await sendPut(`/products/${id}`, body);
};

// Delete Product
export const deleteProduct = async (id: string): Promise<IDeleteProductResponse> => {
	return await sendDelete(`/products/${id}`);
};

// Create Review
export const createReview = async (id: string, body: ICreateReviewBody): Promise<ICreateReviewResponse> => {
	const { order_id, ...reviewBody } = body;
	const queryParams = order_id ? { "order-id": order_id } : undefined;
	return await sendPost(`/products/${id}/reviews`, reviewBody, queryParams);
};

export const getTopProducts = async (query?: IGetTopProductsQuery): Promise<IGetTopProductsResponse> => {
	const modifiedQuery = {
		...query,
		perPage: 10,
	};
	return await sendGet(`/products/top`, modifiedQuery);
};

export const getLatestProducts = async (query?: IGetLatestProductsQuery): Promise<IGetLatestProductsResponse> => {
	const modifiedQuery = {
		...query,
		perPage: 10,
	};
	return await sendGet(`/products/latest`, modifiedQuery);
};

// Get Sale Products
export const getSaleProducts = async (query?: IGetSaleProductsQuery): Promise<IGetSaleProductsResponse> => {
	return await sendGet(`/products/sale`, query);
};

export const getRelatedProducts = async (query?: IGetRelatedProductsQuery): Promise<IGetRelatedProductsResponse> => {
	return await sendGet(`/products/related`, query);
};

// Get Products Sorted By Price
export const getProductsByPrice = async (query?: IGetProductsByPriceQuery): Promise<IGetProductsByPriceResponse> => {
	return await sendGet(`/products/price`, query);
};

// Filter Products
export const filterProducts = async (query?: IFilterProductsQuery): Promise<IFilterProductsResponse> => {
	return await sendGet(`/products/filter`, query);
};

export const searchProductsByName = async (query?: ISearchProductsByNameQuery): Promise<ISearchProductsByNameResponse> => {
	const normalizedQuery: Record<string, any> = {};
	if (query) {
		const searchTerm = query.q || query.query || query.search;
		if (searchTerm) {
			normalizedQuery.q = searchTerm;
		}

		if (query.category) normalizedQuery.category = query.category;
		if (query.articleType) normalizedQuery.articleType = query.articleType;
		if (query.gender) normalizedQuery.gender = query.gender;
		if (query.masterCategory) normalizedQuery.masterCategory = query.masterCategory;
		if (query.subCategory) normalizedQuery.subCategory = query.subCategory;
		if (query.min_price !== undefined) normalizedQuery.min_price = query.min_price;
		if (query.max_price !== undefined) normalizedQuery.max_price = query.max_price;
		if (query.sort_by) normalizedQuery.sort_by = query.sort_by;
		if (query.page !== undefined) normalizedQuery.page = query.page;
		if (query.page_size !== undefined) normalizedQuery.page_size = query.page_size;
	}

	const response = await sendGet(`/products/search_by_name`, normalizedQuery);

	if (response?.data?.products && Array.isArray(response.data.products)) {
		return {
			...response,
			data: {
				...response.data,
				products: response.data.products.map((product: any) => normalizeProduct(product)),
			},
		};
	}

	return response;
};

