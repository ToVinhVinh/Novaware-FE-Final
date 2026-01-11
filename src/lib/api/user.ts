import { sendGet, sendPost, sendPut, sendDelete } from "./axios";
import {
	IGetProfileResponse,
	IUpdateProfileResponse,
	IGetUsersResponse,
	IGetUserByIdResponse,
	IUpdateUserResponse,
	IDeleteUserResponse,
	IAddFavoriteResponse,
	IRemoveFavoriteResponse,
	IGetFavoritesResponse,
	ICheckPurchaseHistoryResponse,
	ICheckGenderResponse,
	ICheckStylePreferenceResponse,
	IGetUsersForTestingResponse,
	ISaveOutfitResponse,
	IGetOutfitsResponse,
	IDeleteOutfitResponse,
} from "../../interface/response/user";
import {
	IUpdateProfileBody,
	IGetUsersQuery,
	IUpdateUserBody,
	IAddFavoriteBody,
	IGetFavoritesQuery,
	IGetUsersForTestingQuery,
	ISaveOutfitBody,
} from "../../interface/request/user";

// Get Profile
export const getProfile = async (): Promise<IGetProfileResponse> => {
	return await sendGet(`/users/profile`);
};

export const updateProfile = async (body: IUpdateProfileBody): Promise<IUpdateProfileResponse> => {
	return await sendPut(`/users/profile`, body);
};

// Get All Users (Admin)
export const getUsers = async (query?: IGetUsersQuery): Promise<IGetUsersResponse> => {
	return await sendGet(`/users`, query);
};

// Get User By ID
export const getUserById = async (id: string): Promise<IGetUserByIdResponse> => {
	return await sendGet(`/users/${id}`);
};

// Update User (Admin)
export const updateUser = async (id: string, body: IUpdateUserBody): Promise<IUpdateUserResponse> => {
	return await sendPut(`/users/${id}`, body);
};

// Delete User (Admin)
export const deleteUser = async (id: string): Promise<IDeleteUserResponse> => {
	return await sendDelete(`/users/${id}`);
};

// Add to Favorites
export const addFavorite = async (userId: string, body: IAddFavoriteBody): Promise<IAddFavoriteResponse> => {
	return await sendPost(`/users/${userId}/favorites`, body);
};

// Remove from Favorites
export const removeFavorite = async (userId: string, productId: string): Promise<IRemoveFavoriteResponse> => {
	return await sendDelete(`/users/${userId}/favorites/${productId}`);
};

// Get Favorites
export const getFavorites = async (userId: string, query?: IGetFavoritesQuery): Promise<IGetFavoritesResponse> => {
	return await sendGet(`/users/${userId}/favorites`, query);
};

// Check Purchase History
export const checkPurchaseHistory = async (userId: string): Promise<ICheckPurchaseHistoryResponse> => {
	return await sendGet(`/users/${userId}/check/purchase-history`);
};

// Check Gender
export const checkGender = async (userId: string): Promise<ICheckGenderResponse> => {
	return await sendGet(`/users/${userId}/check/gender`);
};

// Check Style Preference
export const checkStylePreference = async (userId: string): Promise<ICheckStylePreferenceResponse> => {
	return await sendGet(`/users/${userId}/check/style-preference`);
};

// Get Users for Testing
export const getUsersForTesting = async (query: IGetUsersForTestingQuery): Promise<IGetUsersForTestingResponse> => {
	return await sendGet(`/users/testing`, query);
};

export const saveOutfit = async (userId: string, body: ISaveOutfitBody): Promise<ISaveOutfitResponse> => {
	return await sendPost(`/users/${userId}/outfits`, body);
};

// Get Outfits
export const getOutfits = async (userId: string): Promise<IGetOutfitsResponse> => {
	return await sendGet(`/users/${userId}/outfits`);
};

// Delete Outfit
export const deleteOutfit = async (userId: string, outfitId: string): Promise<IDeleteOutfitResponse> => {
	return await sendDelete(`/users/${userId}/outfits/${outfitId}`);
};

