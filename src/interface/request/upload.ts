// Upload uses FormData, no separate interface needed
export interface IUploadImagesResponse {
	message: string;
	data: string[]; // Array of image URLs
}

