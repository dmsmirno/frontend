
import axios from 'axios';

export const getSession = async (token) => {
  try {
    const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/users/session`, { token });
    console.log("Response: " + response.data)
    return response.data.sessionId;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
}

export const loginOAuthUser = async () => {
  try {
    axios.post(`${process.env.REACT_APP_BACKEND_URL}/users/loginOAuth`).then(response => {
      window.location.href = response.data.url;
    });
  } catch {
    throw new Error('Login failed');
  }
}

export const validateSession = async (user) => {
  try {
    const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/users/validate-session`, {}, {
      headers: { Authorization: `Bearer ${user}` }
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
      headers: { Authorization: `Bearer ${user}` }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};