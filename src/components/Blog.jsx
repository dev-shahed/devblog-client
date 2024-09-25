import PropTypes from 'prop-types';
import { useState } from 'react';
import blogs from '../services/blogs';
import Notification from './Notification';

export default function Blog({ blog, setBlogs }) {
  const [showBlog, setShowBlog] = useState(false);
  const [localBlog, setLocalBlog] = useState(blog);
  const user = JSON.parse(localStorage.getItem('devblogUser'));
  const handleShow = () => {
    setShowBlog(!showBlog);
  };

  const handleLike = async () => {
    try {
      // Pass the full blog object here
      const response = await blogs.likeBlog({
        ...localBlog,
        likes: localBlog.likes + 1, // Increment the likes before sending
      });
      setLocalBlog(response?.data);
    } catch (error) {
      console.error('Error liking the blog:', error);
    }
  };

  const handleDelete = async () => {
    try {
      // confirm the deletion
      const isConfirmed = await Notification.delete(
        `Are you sure you want to delete this blog?`
      );
      if (!isConfirmed) {
        return;
      }
      // Call the deleteBlog function
      const response = await blogs.deleteBlog(blog.id);
      setBlogs((prevBlogs) => prevBlogs.filter((b) => b.id !== blog.id));

      // Check the response status and show a success message
      response.status === 204 &&
        Notification.success('Blog deleted successfully');
    } catch (error) {
      Notification.error(error.response?.data?.error || 'An error occurred');
    }
  };

  return (
    <div className="p-4 blog">
      <div className="p-6 max-w-lg mx-auto bg-white shadow-md rounded-lg">
        <div className="mb-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">{blog.title}</h2>
            <button
              id={`${showBlog ? 'hideBtn' : 'showBtn'}`}
              onClick={handleShow}
              className={`px-3 py-1 rounded transition duration-200 ${
                showBlog ? 'bg-gray-500 text-white' : 'bg-green-700 text-white'
              }`}
            >
              {showBlog ? 'Hide' : 'Show'}
            </button>
          </div>
          <div className="mt-2">
            <span className="text-lg font-light text-gray-700">
              Author: {blog.author}
            </span>
          </div>
        </div>

        <div className={showBlog ? 'visible' : 'hidden'}>
          <p className="text-lg text-gray-700 mb-2">
            Username:{' '}
            <span className="font-medium">{blog?.user?.username}</span>
          </p>
          <a
            href={blog.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline mb-2 block"
          >
            Read more
          </a>
          <p className="text-lg text-gray-700">
            Likes:{' '}
            <span className="font-medium" id="count">
              {localBlog.likes}
            </span>
            <button
              id="likebtn"
              onClick={handleLike}
              className="px-2 mx-3 text-white rounded transition duration-200 bg-purple-500"
            >
              Like
            </button>
          </p>
          {blog.user?.username === user?.username && (
            <button
              onClick={() => handleDelete()}
              className="px-2 py-1 my-3 text-white rounded transition duration-200 bg-red-700"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  setBlogs: PropTypes.func.isRequired,
};
