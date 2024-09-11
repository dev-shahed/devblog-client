import axios from 'axios';

let token = null;

const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

const getBlogs = async () => {
  try {
    const response = await axios.get('/posts');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch blogs:', error);
    return [];
  }
};

const saveBlog = async (blogObj) => {
  const config = {
    headers: { Authorization: token },
  };

  const response = await axios.post('/posts', blogObj, config);
  return response;
};

const likeBlog = async (blogObj) => {
  const config = {
    headers: { Authorization: token },
  };
  const response = await axios.put(`/posts/${blogObj.id}`, blogObj, config);
  return response;
};

const deleteBlog = async (id) => {
  const config = {
    headers: { Authorization: token },
  };
  const response = await axios.delete(`/posts/${id}`, config);
  return response;
};

export default { getBlogs, saveBlog, setToken, likeBlog, deleteBlog };
