import axios from "axios";

const BASE_URL = "/users";

export const createNewUser = async (email, password, name, dob) => {
	const user = {
		email,
		password,
		name,
		dob,
	};
	return await axios.post(`${BASE_URL}/createNewUser`, user, {
		validateStatus: (status) => {
			return true;
		},
	});
};

export const loginUser = async (email, password) => {
	const user = {
		email,
		password,
	};
	return await axios.post(`${BASE_URL}/loginUser`, user, {
		validateStatus: (status) => {
			return true;
		},
	});
};

export const getPointsLeft = async (jwt) => {
	return await axios.get(`${BASE_URL}/getPointsLeft`, {
		headers: {
			Authorization: `Bearer ${jwt}`,
		},
		validateStatus: (status) => {
			return true;
		},
	});
};

export const getName = async (jwt) => {
	return await axios.get(`${BASE_URL}/getName`, {
		headers: {
			Authorization: `Bearer ${jwt}`,
		},
		validateStatus: (status) => {
			return true;
		},
	});
};

export const addPoints = async (jwt, package_name) => {
	const body = {
		package_name: package_name,
	};

	return await axios.post(`${BASE_URL}/addPoints`, body, {
		headers: {
			Authorization: `Bearer ${jwt}`,
		},
		validateStatus: (status) => {
			return true;
		},
	});
};
