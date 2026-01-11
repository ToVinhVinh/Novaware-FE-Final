import { sendGet, sendPost, sendPut, sendDelete } from "./axios";
import {
	IGetContentSectionsResponse,
	ICreateContentSectionResponse,
	IUpdateContentSectionResponse,
	IDeleteContentSectionResponse,
} from "../../interface/response/contentSection";
import {
	IGetContentSectionsQuery,
	ICreateContentSectionBody,
	IUpdateContentSectionBody,
} from "../../interface/request/contentSection";

export const getContentSections = async (query?: IGetContentSectionsQuery): Promise<IGetContentSectionsResponse> => {
	return await sendGet(`/content-sections`, query);
};

export const createContentSection = async (body: ICreateContentSectionBody): Promise<ICreateContentSectionResponse> => {
	return await sendPost(`/content-sections`, body);
};

export const updateContentSection = async (id: string, body: IUpdateContentSectionBody): Promise<IUpdateContentSectionResponse> => {
	return await sendPut(`/content-sections/${id}`, body);
};

export const deleteContentSection = async (id: string): Promise<IDeleteContentSectionResponse> => {
	return await sendDelete(`/content-sections/${id}`);
};

