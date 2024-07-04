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
