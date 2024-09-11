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
export const updateStory = async (jwt, body) => {
  return await axios.post(`${BASE_URL}/updateStory`, body, {
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

export const getPageList = async (jwt, page_number, story_id) => {
  const body = {
    page_number: page_number,
    story_id: story_id,
  };
  return await axios.post(`${BASE_URL}/getPageList`, body, {
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
    validateStatus: (status) => {
      return true;
    },
  });
};

export const initialPageDeleteCheck = async (jwt, page_number, story_id) => {
  const body = {
    page_number: page_number,
    story_id: story_id,
  };
  return await axios.post(`${BASE_URL}/initialPageDeleteCheck`, body, {
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
    validateStatus: (status) => {
      return true;
    },
  });
};

export const pageDelete = async (jwt, page_number, story_id) => {
  const body = {
    page_number: page_number,
    story_id: story_id,
  };
  return await axios.post(`${BASE_URL}/pageDelete`, body, {
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
    validateStatus: (status) => {
      return true;
    },
  });
};

export const buyStory = async (jwt, story_id) => {
  const body = {
    story_id: story_id,
  };
  return await axios.post(`${BASE_URL}/buyStory`, body, {
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
    validateStatus: (status) => {
      return true;
    },
  });
};

export const deleteStory = async (jwt, story_id) => {
  const body = {
    story_id: story_id,
  };
  return await axios.post(`${BASE_URL}/deleteStory`, body, {
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
    validateStatus: (status) => {
      return true;
    },
  });
};

export const cloneStory = async (jwt, story_id) => {
  const body = {
    story_id: story_id,
  };
  return await axios.post(`${BASE_URL}/cloneStory`, body, {
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
    validateStatus: (status) => {
      return true;
    },
  });
};

export const storyExist = async (jwt, story_id) => {
  const body = {
    story_id: story_id,
  };
  return await axios.post(`${BASE_URL}/storyExist`, body, {
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
    validateStatus: (status) => {
      return true;
    },
  });
};

export const getAllStories = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/getAllStories`);
    return response.data;
  } catch (error) {
    console.error("Error fetching stories:", error);
    throw error;
  }
};

export const adminDelete = async (story_id) => {
  return await axios.delete(`${BASE_URL}/adminDelete/${story_id}`, {
    validateStatus: (status) => {
      return true;
    },
  });
};

export const getTotalStories = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/getTotalStories`);
    return response.data.totalStories;
  } catch (error) {
    console.error("Error fetching total stories:", error);
    throw error;
  }
};

export const getStoryViewsOverTime = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/getStoryViewsOverTime`);
    return response.data;
  } catch (error) {
    console.error("Error fetching story views over time:", error);
    throw error;
  }
};
