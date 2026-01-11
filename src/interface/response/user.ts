export interface IPriceRange {
	min: number;
	max: number;
}

export interface IUserPreferences {
	priceRange?: IPriceRange;
	style?: string;
	colorPreferences?: string[];
	brandPreferences?: string[];
}

export interface IContentProfile {
	featureVector?: number[];
	categoryWeights?: number[];
}

export interface IInteractionHistory {
	_id: string;
	productId: string;
	interactionType: "view" | "purchase" | "review" | "like" | "cart";
	rating?: number | null;
	timestamp: string;
}

export interface IUser {
	_id: string;
	name: string;
	email: string;
	isAdmin?: boolean;
	height?: number;
	weight?: number;
	gender?: string;
	age?: number;
	avatar?: string;
	preferences?: IUserPreferences;
	contentProfile?: IContentProfile;
	favorites?: string[];
	userEmbedding?: number[];
	interactionHistory?: IInteractionHistory[];
	outfitHistory?: any[];
	createdAt?: string;
	updatedAt?: string;
}

export interface IRegisterResponse {
	message: string;
	data: IUser;
}

export interface IAuthTokens {
	refresh: string;
	access: string;
}

export interface ILoginResponse {
	status: string;
	message: string;
	data: {
		user?: IUser;
		tokens: IAuthTokens;
	};
}

export interface IForgotPasswordResponse {
	message: string;
}

export interface IVerifyCodeResponse {
	message: string;
	data: {
		resetToken: string;
	};
}

export interface IResetPasswordResponse {
	message: string;
}

export interface IGetProfileResponse {
	message: string;
	data: IUser;
}

export interface IUpdateProfileResponse {
	message: string;
	data: IUser & {
		token?: string;
	};
}

export interface IGetUsersResponse {
	message: string;
	data: {
		users: IUser[];
		page: number;
		pages: number;
		count: number;
	};
}

export interface IGetUserByIdResponse {
	status: string;
	message: string;
	data: {
		user: IUser;
	};
}

export interface IUpdateUserResponse {
	message: string;
	data: {
		user: IUser;
	};
}

export interface IDeleteUserResponse {
	message: string;
}

export interface IAddFavoriteResponse {
	message: string;
}

export interface IRemoveFavoriteResponse {
	message: string;
}

export interface IGetFavoritesResponse {
	message: string;
	data: {
		favorites: any[];
		page: number;
		pages: number;
		count: number;
	};
}

export interface ICheckPurchaseHistoryResponse {
	message: string;
	data: {
		hasPurchaseHistory: boolean;
		orderCount: number;
	};
}

export interface ICheckGenderResponse {
	message: string;
	data: {
		hasGender: boolean;
		gender?: string;
	};
}

export interface ICheckStylePreferenceResponse {
	message: string;
	data: {
		hasStylePreference: boolean;
		style?: string;
	};
}

export interface IGetUsersForTestingQuery {
	type: "personalization" | "outfit-suggestions";
	pageNumber?: number;
	perPage?: number;
}

export interface IGetUsersForTestingResponse {
	message: string;
	data: {
		type: string;
		users: IUser[];
		pagination: {
			page: number;
			pages: number;
			count: number;
			perPage: number;
		};
	};
}

export interface ISaveOutfitResponse {
	status?: string;
	message: string;
	data?: {
		outfit?: any;
	};
}

export interface IOutfitProduct {
	product_id: string | number;
	name: string;
	category?: string;
	price: number;
	sale?: number;
	images?: string[];
	image?: string;
}

export interface ISavedOutfit {
	name: string;
	products: IOutfitProduct[];
	totalPrice: number;
	compatibilityScore: number;
	gender: string;
	style?: string;
	description?: string;
	timestamp?: string;
}

export interface IGetOutfitsResponse {
	success?: boolean;
	status?: string;
	message: string;
	data: {
		outfits: ISavedOutfit[];
		user_id: string;
		total_outfits: number;
	};
}

export interface IDeleteOutfitResponse {
	status?: string;
	message: string;
}

