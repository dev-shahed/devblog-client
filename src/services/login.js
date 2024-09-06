import axios from 'axios';

const login = async (credentials) => {
  const response = await axios.post('/login', credentials);
  console.log(response.data);
  return response.data;
};

export default { login };
