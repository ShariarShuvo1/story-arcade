import axios from 'axios';

const BASE_URL = '/users';

export const createNewUser = async (email, password) => {
    const response = await axios.post(`${BASE_URL}/createNewUser`, { email, password });
    return response;
};

export const loginUser = async (email, password) => {
    const response = await axios.post(`${BASE_URL}/loginUser`, { email, password });
    return response;
};