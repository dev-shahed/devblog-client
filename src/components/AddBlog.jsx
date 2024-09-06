import { Fragment, useState } from 'react';
import blogService from '../services/blogs';

export default function AddBlog() {
  const [blog, setBlog] = useState({
    title: '',
    author: '',
    url: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await blogService.saveBlog(blog); 
      if (response.status === 201) {
        alert('blog created successfully')
      }
    } catch (error) {
      console.error('Error saving blog:', error);
      alert(error)
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
            onChange={({ target }) => setBlog({ ...blog, title: target.value })}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="text"
            name="author"
            placeholder="Author"
            onChange={({ target }) =>
              setBlog({ ...blog, author: target.value })
            }
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="text"
            name="url"
            placeholder="url"
            onChange={({ target }) => setBlog({ ...blog, url: target.value })}
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
