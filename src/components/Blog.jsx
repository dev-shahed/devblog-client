import React from 'react';

export default function ({ blog }) {
  return (
    <div className="p-4">
      <div className="p-4 max-w-lg mx-auto bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-semibold mb-2">{blog.title}</h2>
        <p className="text-lg text-gray-700 mb-2">
          Author: <span className="font-medium">{blog.author}</span>
        </p>
        <p className="text-lg text-gray-700 mb-2">
          Username: <span className="font-medium">{blog?.user?.username}</span>
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
          Likes: <span className="font-medium">{blog.likes}</span>
        </p>
      </div>
    </div>
  );
}
