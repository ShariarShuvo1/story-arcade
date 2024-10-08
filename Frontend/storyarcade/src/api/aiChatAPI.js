import axios from "axios";
import BASE_URL_AI from "./BASE_URL_AI";

const BASE_URL = "/aiChats";

export const getPreviousChats = async (jwt, story_id) => {
	const body = {
		story_id: story_id,
	};
	return await axios.post(`${BASE_URL}/getPreviousChats`, body, {
		headers: {
			Authorization: `Bearer ${jwt}`,
		},
		validateStatus: (status) => {
			return true;
		},
	});
};

export const clearAiChat = async (jwt, story_id) => {
	const body = {
		story_id: story_id,
	};
	return await axios.post(`${BASE_URL}/clearAiChat`, body, {
		headers: {
			Authorization: `Bearer ${jwt}`,
		},
		validateStatus: (status) => {
			return true;
		},
	});
};

export const llamaChat = async (jwt, storyId, message) => {
	const body = {
		storyId: storyId,
		message: message,
	};
	return await axios.post(`${BASE_URL_AI}/llamaChat`, body, {
		headers: {
			Authorization: `Bearer ${jwt}`,
		},
		validateStatus: (status) => {
			return true;
		},
	});
};

export const llamaStoryChat = async (jwt, storyId, message, pageNumber) => {
	const body = {
		storyId: storyId,
		message: message,
		pageNumber: pageNumber,
	};
	return await axios.post(`${BASE_URL_AI}/llamaStoryChat`, body, {
		headers: {
			Authorization: `Bearer ${jwt}`,
		},
		validateStatus: (status) => {
			return true;
		},
	});
};
