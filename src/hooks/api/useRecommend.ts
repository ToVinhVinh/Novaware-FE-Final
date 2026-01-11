import { useMutation } from '@tanstack/react-query';
import {
	trainGNNModel,
	trainCBFModel,
	trainHybridModel,
	getGNNModelRecommendations,
	getCBFModelRecommendations,
	getHybridModelRecommendations,
	trainGNNModelWithTaskId,
} from '../../lib/api/recommend';
import * as RecommendTypes from '../../interface/response/recommend';
import * as RecommendRequestTypes from '../../interface/request/recommend';

export const useTrainGNNModel = () => {
	return useMutation<RecommendTypes.IModelTrainingResponse, Error, RecommendRequestTypes.ITrainGNNRequest>({
		mutationFn: trainGNNModel,
	});
};

export const useTrainCBFModel = () => {
	return useMutation<RecommendTypes.IModelTrainingResponse, Error, RecommendRequestTypes.ITrainCBFRequest>({
		mutationFn: trainCBFModel,
	});
};

export const useTrainHybridModel = () => {
	return useMutation<RecommendTypes.IModelTrainingResponse, Error, RecommendRequestTypes.ITrainHybridRequest>({
		mutationFn: trainHybridModel,
	});
};

export const useGNNModelRecommendations = () => {
	return useMutation<RecommendTypes.IModelRecommendationResponse, Error, RecommendRequestTypes.IGNNRecommendRequest>({
		mutationFn: getGNNModelRecommendations,
	});
};

export const useCBFModelRecommendations = () => {
	return useMutation<RecommendTypes.IModelRecommendationResponse, Error, RecommendRequestTypes.ICBFRecommendRequest>({
		mutationFn: getCBFModelRecommendations,
	});
};

export const useHybridModelRecommendations = () => {
	return useMutation<RecommendTypes.IModelRecommendationResponse, Error, RecommendRequestTypes.IHybridRecommendRequest>({
		mutationFn: getHybridModelRecommendations,
	});
};

export const useTrainGNNModelWithTaskId = () => {
	return useMutation<RecommendTypes.ITrainGNNWithTaskIdResponse, Error, RecommendRequestTypes.ITrainGNNWithTaskIdRequest>({
		mutationFn: trainGNNModelWithTaskId,
	});
};

