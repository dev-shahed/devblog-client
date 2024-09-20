import axios from 'axios';
import loginService from './login';

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
  const response = await axios.post('/posts', blogObj, loginService.getToken());
  return response;
};

const likeBlog = async (blogObj) => {
  const response = await axios.put(`/posts/${blogObj.id}`, blogObj, loginService.getToken());
  return response;
};

const deleteBlog = async (id) => {
  const response = await axios.delete(`/posts/${id}`, loginService.getToken());
  return response;
};

export default { getBlogs, saveBlog, likeBlog, deleteBlog };
