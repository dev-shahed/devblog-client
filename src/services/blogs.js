/**
 * @fileoverview This module provides services for interacting with blog-related API endpoints.
 * It uses axios for HTTP requests and depends on the loginService for authentication.
 */

import axios from 'axios';
import loginService from './login';

/**
 * Fetches all blogs from the server.
 * @async
 * @returns {Promise<Array>} A promise that resolves to an array of blog objects.
 */
const getBlogs = async () => {
  try {
    const response = await axios.get('/posts');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch blogs:', error);
    return [];
  }
};

/**
 * Saves a new blog post to the server.
 * @async
 * @param {Object} blogObj - The blog object to be saved.
 * @returns {Promise<Object>} A promise that resolves to the response from the server.
 */
const saveBlog = async (blogObj) => {
  const response = await axios.post('/posts', blogObj, loginService.getToken());
  return response;
};

/**
 * Updates a blog post with new like count.
 * @async
 * @param {Object} blogObj - The blog object to be updated.
 * @returns {Promise<Object>} A promise that resolves to the response from the server.
 */
const likeBlog = async (blogObj) => {
  const response = await axios.put(`/posts/${blogObj.id}`, blogObj, loginService.getToken());
  return response;
};

/**
 * Deletes a blog post from the server.
 * @async
 * @param {string|number} id - The ID of the blog post to be deleted.
 * @returns {Promise<Object>} A promise that resolves to the response from the server.
 */
const deleteBlog = async (id) => {
  const response = await axios.delete(`/posts/${id}`, loginService.getToken());
  return response;
};

export default { getBlogs, saveBlog, likeBlog, deleteBlog };
