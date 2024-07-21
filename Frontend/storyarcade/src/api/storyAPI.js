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


export const getPage = async (jwt, story_id, page_number) => {
    const body = {
        story_id: story_id,
		page_number: page_number,
    };
	return await axios.post(`${BASE_URL}/getPage`, body, {
		headers: {
			Authorization: `Bearer ${jwt}`,
		},
		validateStatus: (status) => {
			return true;
		},
	});
};

export const saveAPage = async (jwt, page, story_id) => {
    const body = {
        page: page,
		story_id: story_id,
    };
	return await axios.post(`${BASE_URL}/saveAPage`, body, {
		headers: {
			Authorization: `Bearer ${jwt}`,
		},
		validateStatus: (status) => {
			return true;
		},
	});
};

