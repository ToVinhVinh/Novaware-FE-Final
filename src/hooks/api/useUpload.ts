import { useMutation } from '@tanstack/react-query';
import { uploadImages } from '../../lib/api/upload';
import { IUploadImagesResponse } from '../../interface/request/upload';

export const useUploadImages = () => {
	return useMutation<IUploadImagesResponse, Error, FormData>({
		mutationFn: uploadImages,
	});
};

