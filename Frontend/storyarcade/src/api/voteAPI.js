import axios from "axios";

const BASE_URL = "/vote";

export const voteHandle = async (jwt, storyId, voteType) => {
    const body = {
        storyId: storyId,
        voteType: voteType,
    };
    return await axios.post(`${BASE_URL}/voteHandle`, body, {
        headers: {
            Authorization: `Bearer ${jwt}`,
        },
        validateStatus: (status) => {
            return true;
        },
    });
};