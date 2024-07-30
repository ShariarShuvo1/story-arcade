import axios from "axios";

const BASE_URL = "/getStory";

export const getInitialPopular = async () => {
	return await axios.get(`${BASE_URL}/getInitialPopular`, {
		validateStatus: (status) => {
			return true;
		},
	});
};

export const getStoryAccess = async (jwt, storyId) => {
	const body = {
		storyId: storyId,
	};
	return await axios.post(`${BASE_URL}/getStoryAccess`, body, {
		headers: {
			Authorization: `Bearer ${jwt}`,
		},
		validateStatus: (status) => {
			return true;
		},
	});
};

export const getNextPopular = async (jwt, storyIds) => {
	const body = {
		storyIds: storyIds,
	};
	return await axios.post(`${BASE_URL}/getNextPopular`, body, {
		headers: {
			Authorization: `Bearer ${jwt}`,
		},
		validateStatus: (status) => {
			return true;
		},
	});
};

export const provideFreeAccess = async (jwt, storyId) => {
	const body = {
		storyId: storyId,
	};
	return await axios.post(`${BASE_URL}/provideFreeAccess`, body, {
		headers: {
			Authorization: `Bearer ${jwt}`,
		},
		validateStatus: (status) => {
			return true;
		},
	});
};

export const provideFollowerAccess = async (jwt, storyId) => {
	const body = {
		storyId: storyId,
	};
	return await axios.post(`${BASE_URL}/provideFollowerAccess`, body, {
		headers: {
			Authorization: `Bearer ${jwt}`,
		},
		validateStatus: (status) => {
			return true;
		},
	});
};
