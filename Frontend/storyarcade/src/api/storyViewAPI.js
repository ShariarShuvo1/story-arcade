import axios from "axios";

const BASE_URL = "/storyView";

export const getInitialPages = async (jwt, story_id, page_no = null) => {
	const body = {
		story_id: story_id,
		page_no: page_no,
	};
	return await axios.post(`${BASE_URL}/getInitialPages`, body, {
		headers: {
			Authorization: `Bearer ${jwt}`,
		},
		validateStatus: (status) => {
			return true;
		},
	});
};

export const getNextPages = async (jwt, story_id, child_pages) => {
	const body = {
		story_id: story_id,
		child_pages: child_pages,
	};
	return await axios.post(`${BASE_URL}/getNextPages`, body, {
		headers: {
			Authorization: `Bearer ${jwt}`,
		},
		validateStatus: (status) => {
			return true;
		},
	});
};
