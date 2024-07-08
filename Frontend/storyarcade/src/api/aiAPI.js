import axios from "axios";

const BASE_URL_AI = "http://127.0.0.1:8000";

export const llamaGetTitle = async (jwt, story) => {
    const body = {
        story: story,
    };
    return await axios.post(`${BASE_URL_AI}/llamaGetTitle`, body, {
        headers: {

            Authorization: `Bearer ${jwt}`,
        },
        validateStatus: (status) => {
            return true;
        },
    });
};

export const sdGetImage = async (jwt, story, specificPrompt) => {
    const body = {
        story : story,
        specificPrompt: specificPrompt,
    };

    return await axios.post(`${BASE_URL_AI}/sdGetImage`, body, {
        headers: {
            Authorization: `Bearer ${jwt}`,
        },
        validateStatus: (status) => {
            return true;
        },
    });
};