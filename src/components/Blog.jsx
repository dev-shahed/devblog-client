import { useState } from 'react';
import blogs from '../services/blogs';

export default function Blog({ blog }) {
  const [showBlog, setShowBlog] = useState(false);
  const [localBlog, setLocalBlog] = useState(blog);
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

  return (
    <div className="p-4">
      <div className="p-6 max-w-lg mx-auto bg-white shadow-md rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{blog.title}</h2>
          <button
            onClick={handleShow}
            className={`px-3 py-1 rounded transition duration-200 ${
              showBlog ? 'bg-gray-500 text-white' : 'bg-green-700 text-white'
            }`}
          >
            {showBlog ? 'Hide' : 'Show'}
          </button>
        </div>

        <div className={showBlog ? 'visible' : 'hidden'}>
          <p className="text-lg text-gray-700 mb-2">
            Author: <span className="font-medium">{blog.author}</span>
          </p>
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
            Likes: <span className="font-medium">{localBlog.likes}</span>
            <button
              onClick={handleLike}
              className="px-2 mx-3 rounded transition duration-200 bg-purple-500"
            >
              Like
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
