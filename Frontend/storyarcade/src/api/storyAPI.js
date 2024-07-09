import axios from "axios";

const BASE_URL = "/story";

export const createStory = async (jwt, body) => {
	return await axios.post(`${BASE_URL}/create`, body, {
		headers: {
			Authorization: `Bearer ${jwt}`,
		},
		validateStatus: (status) => {
			return true;
		},
	});
};

export const getStory = async (jwt, story_id) => {
    const body = {
        story_id: story_id,
    };
	return await axios.post(`${BASE_URL}/getStory`, body, {
		headers: {
			Authorization: `Bearer ${jwt}`,
		},
		validateStatus: (status) => {
			return true;
		},
	});
};

export const saveChanges = async (jwt, story, story_id) => {
    const body = {
        story: story,
		story_id: story_id,
    };
	return await axios.post(`${BASE_URL}/saveChanges`, body, {
		headers: {
			Authorization: `Bearer ${jwt}`,
		},
		validateStatus: (status) => {
			return true;
		},
	});
};
