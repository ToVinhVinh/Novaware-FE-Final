import { sendPost } from "./axios";
import { IUploadImagesResponse } from "../../interface/request/upload";

export const uploadImages = async (formData: FormData): Promise<IUploadImagesResponse> => {
	return await sendPost(`/upload`, formData);
};

