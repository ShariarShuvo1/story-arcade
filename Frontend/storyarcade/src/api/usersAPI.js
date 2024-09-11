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

export const followUser = async (jwt, to_follow) => {
  const body = {
    to_follow: to_follow,
  };

  return await axios.post(`${BASE_URL}/followUser`, body, {
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
    validateStatus: (status) => {
      return true;
    },
  });
};

export const checkIfFollow = async (jwt, author) => {
  const body = {
    author: author,
  };

  return await axios.post(`${BASE_URL}/checkIfFollow`, body, {
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
    validateStatus: (status) => {
      return true;
    },
  });
};

export const getFriendSuggestion = async (jwt) => {
  return await axios.get(`${BASE_URL}/getFriendSuggestion`, {
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
    validateStatus: (status) => {
      return true;
    },
  });
};

export const getTotalUsers = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/getTotalUsers`);
    return response.data.totalUsers;
  } catch (error) {
    console.error("Error fetching total users:", error);
    throw error;
  }
};
