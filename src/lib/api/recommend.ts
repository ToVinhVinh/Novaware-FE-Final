import { sendPost } from "./axios";
import {
	IModelTrainingResponse,
	IModelRecommendationResponse,
	ITrainGNNWithTaskIdResponse,
} from "../../interface/response/recommend";
import {
	ITrainGNNRequest,
	ITrainCBFRequest,
	ITrainHybridRequest,
	IGNNRecommendRequest,
	ICBFRecommendRequest,
	IHybridRecommendRequest,
	ITrainGNNWithTaskIdRequest,
} from "../../interface/request/recommend";

const getMlServiceBaseUrl = () => {
	const base =
		import.meta.env.VITE_RECOMMENDER_API_URL ||
		import.meta.env.VITE_RECSYS_API_URL ||
		import.meta.env.VITE_API_URL ||
		"http://localhost:8000";

	return base.replace(/\/$/, "");
};

const buildMlServiceUrl = (path: string) => `${getMlServiceBaseUrl()}${path}`;

export const trainGNNModel = async (body: ITrainGNNRequest): Promise<IModelTrainingResponse> => {
	return await sendPost(buildMlServiceUrl(`/api/v1/gnn/train/`), body);
};

export const trainCBFModel = async (body: ITrainCBFRequest): Promise<IModelTrainingResponse> => {
	return await sendPost(buildMlServiceUrl(`/api/v1/cbf/train/`), body);
};

export const trainHybridModel = async (body: ITrainHybridRequest): Promise<IModelTrainingResponse> => {
	return await sendPost(buildMlServiceUrl(`/api/v1/hybrid/train/`), body);
};

export const getGNNModelRecommendations = async (body: IGNNRecommendRequest): Promise<IModelRecommendationResponse> => {
	return await sendPost(buildMlServiceUrl(`/api/v1/gnn/recommend/`), body);
};

export const getCBFModelRecommendations = async (body: ICBFRecommendRequest): Promise<IModelRecommendationResponse> => {
	return await sendPost(buildMlServiceUrl(`/api/v1/cbf/recommend/`), body);
};

export const getHybridModelRecommendations = async (body: IHybridRecommendRequest): Promise<IModelRecommendationResponse> => {
	return await sendPost(buildMlServiceUrl(`/api/v1/hybrid/recommend/`), body);
};

export const trainGNNModelWithTaskId = async (body: ITrainGNNWithTaskIdRequest): Promise<ITrainGNNWithTaskIdResponse> => {
	return await sendPost(buildMlServiceUrl(`/api/v1/gnn/train`), body);
};

