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
  return loginService.withTokenRefresh(async () => {
    const response = await axios.post('/posts', blogObj);
    return response.data;
  });
};

const likeBlog = async (blogObj) => {
  return loginService.withTokenRefresh(async () => {
    const response = await axios.put(`/posts/${blogObj.id}`, blogObj);
    return response.data;
  });
};

const deleteBlog = async (id) => {
  return loginService.withTokenRefresh(async () => {
    const response = await axios.delete(`/posts/${id}`);
    return response.data;
  });
};

export default { getBlogs, saveBlog, likeBlog, deleteBlog };
