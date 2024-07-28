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

export const imageGenForPage = async (jwt, prompt, storyId=null, pageNumber=null) => {
    const body = {
        prompt: prompt,
        storyId: storyId,
        pageNumber: pageNumber,
    };

    return await axios.post(`${BASE_URL_AI}/imageGenForPage`, body, {
        headers: {
            Authorization: `Bearer ${jwt}`,
        },
        validateStatus: (status) => {
            return true;
        },
    });
};


export const gifGenForPage = async (jwt, prompt, storyId=null, pageNumber=null) => {
    const body = {
        prompt: prompt,
        storyId: storyId,
        pageNumber: pageNumber,
    };

    return await axios.post(`${BASE_URL_AI}/gifGenForPage`, body, {
        headers: {
            Authorization: `Bearer ${jwt}`,
        },
        validateStatus: (status) => {
            return true;
        },
    });
};
