import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:3001/api';

const getBlogs = async () => {
  try {
    const response = await axios.get('/posts');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch blogs:', error);
    return [];
  }
};

export default { getBlogs };
