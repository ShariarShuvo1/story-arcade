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