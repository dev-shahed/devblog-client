import { Fragment, useState } from 'react';
import blogService from '../services/blogs';
import Notification from './Notification';

export default function AddBlog({ setBlogs, blogFormRef }) {
  const [blog, setBlog] = useState({
    title: '',
    author: '',
    url: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBlog({
      ...blog,
      [name]: value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await blogService.saveBlog(blog);
      blogFormRef.current.toggleVisibility();
      if (response.status === 201) {
        Notification.success('Blog created successfully');
        setBlogs((prevBlogs) => [...prevBlogs, response.data]);
        setBlog({
          title: '',
          author: '',
          url: '',
        });
      }
    } catch (error) {
      Notification.error(error.response?.data?.error || 'An error occurred');
    }
  };

  return (
    <Fragment>
      <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Add Blog</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={blog.title}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="text"
            name="author"
            placeholder="Author"
            value={blog.author}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="text"
            name="url"
            placeholder="URL"
            value={blog.url}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            Add Blog
          </button>
        </form>
      </div>
    </Fragment>
  );
}
