
import axios from 'axios';

export const loginUser = async (username, password) => {
  try {
    const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/users/login`, { username, password });
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

export const validateSession = async (user) => {
  try {
    const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/users/validate-session`, {}, {
      headers: { Authorization: `Bearer ${user.sessionId}` }
    });
    return response.data.isValid;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error(error.message);
    }
  }
};

export const logoutUser = async (user) => {
  try {
    const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/users/logout`, {}, {
      headers: { Authorization: `Bearer ${user.sessionId}` }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};