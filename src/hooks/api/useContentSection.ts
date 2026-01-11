import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
	getContentSections,
	createContentSection,
	updateContentSection,
	deleteContentSection,
} from '../../lib/api/contentSection';
import * as ContentSectionTypes from '../../interface/response/contentSection';
import * as ContentSectionRequestTypes from '../../interface/request/contentSection';

export const useGetContentSections = (query?: ContentSectionRequestTypes.IGetContentSectionsQuery) => {
	return useQuery<ContentSectionTypes.IGetContentSectionsResponse, Error>({
		queryKey: ['content-sections', 'list', query],
		queryFn: () => getContentSections(query),
	});
};

export const useCreateContentSection = () => {
	const queryClient = useQueryClient();

	return useMutation<
		ContentSectionTypes.ICreateContentSectionResponse,
		Error,
		ContentSectionRequestTypes.ICreateContentSectionBody
	>({
		mutationFn: createContentSection,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['content-sections'] });
		},
	});
};

export const useUpdateContentSection = () => {
	const queryClient = useQueryClient();

	return useMutation<
		ContentSectionTypes.IUpdateContentSectionResponse,
		Error,
		{ id: string; body: ContentSectionRequestTypes.IUpdateContentSectionBody }
	>({
		mutationFn: ({ id, body }) => updateContentSection(id, body),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['content-sections'] });
		},
	});
};

export const useDeleteContentSection = () => {
	const queryClient = useQueryClient();

	return useMutation<ContentSectionTypes.IDeleteContentSectionResponse, Error, string>({
		mutationFn: deleteContentSection,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['content-sections'] });
		},
	});
};

