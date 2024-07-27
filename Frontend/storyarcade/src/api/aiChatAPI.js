import axios from "axios";

const BASE_URL = "/aiChats";
const BASE_URL_AI = "http://127.0.0.1:8000";

export const getPreviousChats = async (jwt, story_id) => {
    const body = {
        story_id: story_id
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
        story_id: story_id
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