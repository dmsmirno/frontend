import axios from 'axios';

export const startMovieParty = async (sessionType, customSessionType) => {
  try {
    const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/movies/start`, { sessionType, customSessionType });
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

export const getCustomSessionOptions = async (user) => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/movies/custom-session-options`, {
      headers: { Authorization: `Bearer ${user}` }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

export const getFavorites = async (user) => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/movies/favorites`, {
      headers: { Authorization: `Bearer ${user}` }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

export const getWatchlist = async (user) => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/movies/watchlist`, {
      headers: { Authorization: `Bearer ${user}` }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

export const getCustomLists = async (user) => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/movies/custom-lists`, {
      headers: { Authorization: `Bearer ${user}` }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

export const getCustomListContent = async (user, customSelection) => {
  if (!customSelection) {
    return [];
  }

  try {
    const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/movies/custom-list-content`, {
      headers: { Authorization: `Bearer ${user}` },
      params: { customSelection }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

export const createParty = async (movies, user) => {
  try {
    const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/movies/create-party`, { movies }, {
      headers: {
        Authorization: `Bearer ${user}`
      }
    });
    return response;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    } else {
      throw error;
    }
  }
};

export const joinParty = async (inviteCode) => {
  try {
    const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/movies/join-party`, { inviteCode }, {});
    return response;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    } else {
      throw error;
    }
  } 
};