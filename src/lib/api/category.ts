import { sendGet, sendPost, sendPut, sendDelete } from "./axios";
import {
	IGetCategoriesResponse,
	IGetCategoryCountsResponse,
	ICreateCategoryResponse,
	IUpdateCategoryResponse,
	IDeleteCategoryResponse,
} from "../../interface/response/category";
import {
	IGetCategoriesQuery,
	ICreateCategoryBody,
	IUpdateCategoryBody,
} from "../../interface/request/category";

export const getCategories = async (query?: IGetCategoriesQuery): Promise<IGetCategoriesResponse> => {
	return await sendGet(`/categories`, query);
};

export const getCategoryCounts = async (query?: IGetCategoriesQuery): Promise<IGetCategoryCountsResponse> => {
	return await sendGet(`/categories/counts`, query);
};

export const createCategory = async (body: ICreateCategoryBody): Promise<ICreateCategoryResponse> => {
	return await sendPost(`/categories`, body);
};

export const updateCategory = async (id: string, body: IUpdateCategoryBody): Promise<IUpdateCategoryResponse> => {
	return await sendPut(`/categories/${id}`, body);
};

export const deleteCategory = async (id: string): Promise<IDeleteCategoryResponse> => {
	return await sendDelete(`/categories/${id}`);
};

